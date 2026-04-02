/**
 * Service for handling match participation logic, including booking places in a match.
 * - Exposes a function `bookMatchPlaces` which takes the match ID, current user ID, and requested slot indexes, and attempts to book those places in the match.
 * - Handles various edge cases such as user not signed in, already joined, match full, etc., and returns appropriate status codes for the UI to handle.
 * - Interacts with Firestore to read the latest match data, check slot availability, and update the match document with the new player information if booking is successful.
 */

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { MatchDoc } from "../model/types";

export type BookPlaceStatus =
  | "success"
  | "sign_in_required"
  | "already_joined"
  | "select_slot"
  | "match_unavailable"
  | "match_full";

type BookPlaceInput = {
  matchId: string;
  currentUserId: string | null;
  requestedSlotIndexes: number[];
};

export const bookMatchPlaces = async ({
  matchId,
  currentUserId,
  requestedSlotIndexes,
}: BookPlaceInput): Promise<BookPlaceStatus> => {
  if (!currentUserId) return "sign_in_required";

  const requestedSlots = Array.from(
    new Set(requestedSlotIndexes.filter((slot) => slot >= 0 && slot < 4)),
  );

  if (requestedSlots.length === 0) {
    return "select_slot";
  }

  const latestMatchSnap = await getDoc(doc(db, "matches", matchId));
  if (!latestMatchSnap.exists()) {
    return "match_unavailable";
  }

  const latestMatch: MatchDoc = {
    id: latestMatchSnap.id,
    ...(latestMatchSnap.data() as Omit<MatchDoc, "id">),
  };

  const latestSlots = Array.from({ length: 4 }, (_, index) => {
    const value = latestMatch.players?.[index];
    return typeof value === "string" && value.trim().length > 0 ? value : null;
  });

  if (latestSlots.some((playerId) => playerId === currentUserId)) {
    return "already_joined";
  }

  const hasUnavailableSlot = requestedSlots.some(
    (slot) => latestSlots[slot] !== null,
  );
  const hasSpace = latestSlots.some((slot) => slot === null);

  if (hasUnavailableSlot || !hasSpace) {
    return "match_full";
  }

  requestedSlots.forEach((slot) => {
    latestSlots[slot] = currentUserId;
  });

  const nextStatus = latestSlots.every(Boolean) ? "full" : "open";

  const joiningUserSnap = await getDoc(doc(db, "users", currentUserId));
  const joiningUserName = joiningUserSnap.data()?.username ?? "Unknown";

  const latestMatchData = latestMatchSnap.data() as any;
  const currentNames: (string | null)[] = Array.from(
    { length: 4 },
    (_, index) => latestMatchData.playerNames?.[index] ?? null,
  );

  requestedSlots.forEach((slot) => {
    currentNames[slot] = joiningUserName;
  });

  await updateDoc(doc(db, "matches", matchId), {
    players: latestSlots,
    playerNames: currentNames,
    status: nextStatus,
  });

  return "success";
};
