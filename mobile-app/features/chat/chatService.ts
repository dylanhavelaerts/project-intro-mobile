/**
 * This file contains all data fetching and persistence logic related to the Chat feature, including:
 * - Fetching and structuring chat messages for a match chat
 * - Fetching and structuring match metadata for display in the chat header
 * - Creating new chat messages
 */

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import {
  BookingDoc,
  ChatMessage,
  ChatMessageDoc,
  CourtDoc,
  LocationDoc,
  MatchChatMeta,
  MatchDoc,
  UserDoc,
} from "./types";
import { formatDateLabel, minutesToHHMM } from "./chatFormatters";

export const fetchCurrentUserName = async (
  userId: string,
  fallbackName: string,
) => {
  const userSnap = await getDoc(doc(db, "users", userId));
  const user = userSnap.exists() ? (userSnap.data() as UserDoc) : null;
  return user?.username ?? fallbackName;
};

export const fetchMatchChatMeta = async (
  chatId: string,
): Promise<MatchChatMeta> => {
  const matchSnap = await getDoc(doc(db, "matches", chatId));

  if (!matchSnap.exists()) {
    return {
      courtTitle: "Match not found",
      dateSubtitle: "Unknown date",
      locationDetailsId: null,
    };
  }

  const match: MatchDoc = {
    id: matchSnap.id,
    ...(matchSnap.data() as Omit<MatchDoc, "id">),
  };

  let resolvedCourtId: string | null = match.courtId ?? null;
  let resolvedLocationId: string | null = match.locationId ?? null;

  if (
    !resolvedCourtId &&
    match.locationId &&
    match.dateKey &&
    Number.isFinite(match.startMinute)
  ) {
    const bookingSnap = await getDocs(
      query(
        collection(db, "bookings"),
        where("locationId", "==", match.locationId),
        where("dateKey", "==", match.dateKey),
        where("startMinute", "==", match.startMinute),
        where("status", "==", "confirmed"),
      ),
    );

    const booking = bookingSnap.docs[0]?.data() as BookingDoc | undefined;
    resolvedCourtId = booking?.courtId ?? null;
    resolvedLocationId = booking?.locationId ?? resolvedLocationId;
  }

  const [locationSnap, courtSnap] = await Promise.all([
    match.locationId
      ? getDoc(doc(db, "locations", match.locationId))
      : Promise.resolve(null),
    resolvedCourtId ? getDoc(doc(db, "courts", resolvedCourtId)) : Promise.resolve(null),
  ]);

  const location =
    locationSnap && locationSnap.exists()
      ? (locationSnap.data() as LocationDoc)
      : null;
  const court =
    courtSnap && courtSnap.exists() ? (courtSnap.data() as CourtDoc) : null;

  return {
    courtTitle: court?.name ?? location?.name ?? "Match court",
    dateSubtitle: `${formatDateLabel(match.dateKey)} · ${minutesToHHMM(match.startMinute)}`,
    locationDetailsId: resolvedLocationId,
  };
};

export const subscribeToMatchMessages = (
  chatId: string,
  currentUserId: string,
  onMessages: (messages: ChatMessage[]) => void,
  onError: (error: unknown) => void,
) => {
  const messagesQuery = query(
    collection(db, "matches", chatId, "messages"),
    orderBy("createdAt", "asc"),
  );

  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      const mapped = snapshot.docs.map((messageSnap) => {
        const raw = messageSnap.data() as ChatMessageDoc;
        return {
          id: messageSnap.id,
          text: raw.text ?? "",
          senderId: raw.senderId ?? "unknown",
          senderName:
            raw.senderId !== currentUserId && raw.senderName === "You"
              ? "Player"
              : (raw.senderName ?? "Player"),
          createdAtMs: raw.createdAt
            ? raw.createdAt.seconds * 1000
            : Number.MAX_SAFE_INTEGER,
        } as ChatMessage;
      });

      onMessages(mapped);
    },
    onError,
  );
};

export const createMatchMessage = async (
  chatId: string,
  text: string,
  senderId: string,
  senderName: string,
) => {
  await addDoc(collection(db, "matches", chatId, "messages"), {
    text,
    senderId,
    senderName,
    createdAt: serverTimestamp(),
  });
};
