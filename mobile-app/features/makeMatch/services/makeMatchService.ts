/**
 * Service module for handling operations related to making a match, including loading venue details, 
 * fetching bookings and matches for a specific day, creating bookings and matches, and joining matches.
 * - loadVenueDetails: Fetches location and court details for a given location ID
 * - fetchBookingsForDay: Fetches confirmed bookings for a specific location and date
 */

import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import type { Court } from "@/types";
import type { Booking, DurationMinutes, MatchDoc, VenueDetails } from "../model/types";

export const loadVenueDetails = async (
  locationId: string,
): Promise<VenueDetails> => {
  const [locSnap, courtsSnap] = await Promise.all([
    getDoc(doc(db, "locations", locationId)),
    getDocs(query(collection(db, "courts"), where("locationId", "==", locationId))),
  ]);

  if (!locSnap.exists()) {
    return { location: null, courts: [] };
  }

  return {
    location: { id: locSnap.id, ...(locSnap.data() as any) },
    courts: courtsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })),
  };
};

export const fetchBookingsForDay = async (
  locationId: string,
  dateKey: string,
): Promise<Booking[]> => {
  const snap = await getDocs(
    query(
      collection(db, "bookings"),
      where("locationId", "==", locationId),
      where("dateKey", "==", dateKey),
      where("status", "==", "confirmed"),
    ),
  );

  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
};

export const fetchMatchesForDay = async (
  locationId: string,
  dateKey: string,
): Promise<MatchDoc[]> => {
  const snap = await getDocs(
    query(
      collection(db, "matches"),
      where("locationId", "==", locationId),
      where("dateKey", "==", dateKey),
      where("status", "==", "open"),
    ),
  );

  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
};

export const createBooking = async (params: {
  locationId: string;
  court: Court;
  dateKey: string;
  startMinute: number;
  durationMinutes: DurationMinutes;
}) => {
  const { locationId, court, dateKey, startMinute, durationMinutes } = params;

  await addDoc(collection(db, "bookings"), {
    locationId,
    courtId: court.id,
    dateKey,
    startMinute,
    endMinute: startMinute + durationMinutes,
    durationMinutes,
    status: "confirmed",
    createdBy: auth.currentUser?.uid ?? "anonymous",
    createdAt: serverTimestamp(),
  });
};

export const createMatch = async (params: {
  locationId: string;
  dateKey: string;
  startMinute: number;
  durationMinutes: DurationMinutes;
  levelMin: number;
  levelMax: number;
  mixed: boolean;
  competitive: boolean;
}) => {
  const userId = auth.currentUser?.uid ?? "anonymous";
  const userName = await getUserName(userId);
  const { durationMinutes } = params;
  const pricePerPlayer =
    durationMinutes === 60 ? 6 : durationMinutes === 90 ? 8 : 10;

  await addDoc(collection(db, "matches"), {
    locationId: params.locationId,
    courtId: null,
    dateKey: params.dateKey,
    startMinute: params.startMinute,
    durationMinutes,
    createdBy: userId,
    players: [userId],
    playerNames: [userName],
    levelMin: params.levelMin,
    levelMax: params.levelMax,
    mixed: params.mixed,
    competitive: params.competitive,
    status: "open",
    pricePerPlayer,
    createdAt: serverTimestamp(),
  });
};

export const joinMatch = async (matchId: string) => {
  const userId = auth.currentUser?.uid ?? "anonymous";
  const userName = await getUserName(userId);

  const matchRef = doc(db, "matches", matchId);
  const matchSnap = await getDoc(matchRef);
  const matchData = matchSnap.data();

  if (!matchData) {
    return { status: "not_found" as const };
  }
  if (matchData.players?.includes(userId)) {
    return { status: "already_joined" as const };
  }
  if ((matchData.players?.length ?? 0) >= 4) {
    return { status: "full" as const };
  }

  await updateDoc(matchRef, {
    players: arrayUnion(userId),
    playerNames: arrayUnion(userName),
    status: matchData.players?.length === 3 ? "full" : "open",
  });

  return { status: "joined" as const };
};

const getUserName = async (userId: string) => {
  const userSnap = await getDoc(doc(db, "users", userId));
  return userSnap.data()?.username ?? "Unknown";
};
