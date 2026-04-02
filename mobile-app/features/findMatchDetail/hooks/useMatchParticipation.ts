/**
 * Hook for managing match participation logic, including tracking pending slot selections, handling slot presses, and booking selected places.
 * - Manages local state for pending slot selections and booking busy status
 * - Provides a function to handle slot presses, which toggles pending selection and checks for edge cases (occupied, sign-in required, already joined)
 * - Provides a function to book selected places, which calls the matchParticipationService and handles different response statuses
 */

import { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import { formatLevel } from "../model/matchDetailFormatters";
import { MatchDoc, PlayerView, UserDoc } from "../model/types";
import {
  bookMatchPlaces,
  BookPlaceStatus,
} from "../services/matchParticipationService";

type SlotPressStatus = "ok" | "occupied" | "sign_in_required" | "already_joined";

type UseMatchParticipationInput = {
  match: MatchDoc | null;
  playerSlots: (PlayerView | null)[];
  refresh: () => Promise<void>;
};

type UseMatchParticipationResult = {
  currentUserId: string | null;
  pendingSlotIndexes: number[];
  renderedPlayerSlots: (PlayerView | null)[];
  bookingBusy: boolean;
  onSlotPress: (slotIndex: number) => SlotPressStatus;
  bookSelectedPlaces: () => Promise<BookPlaceStatus | "payment_failed">;
};

export const useMatchParticipation = ({
  match,
  playerSlots,
  refresh,
}: UseMatchParticipationInput): UseMatchParticipationResult => {
  const currentUserId = auth.currentUser?.uid ?? null;

  const [pendingSlotIndexes, setPendingSlotIndexes] = useState<number[]>([]);
  const [bookingBusy, setBookingBusy] = useState(false);
  const [currentUserPreview, setCurrentUserPreview] =
    useState<PlayerView | null>(null);

  useEffect(() => {
    const loadCurrentUserPreview = async () => {
      if (!currentUserId) {
        setCurrentUserPreview(null);
        return;
      }

      const existingPlayer = playerSlots.find(
        (player) => player?.id === currentUserId,
      );
      if (existingPlayer) {
        setCurrentUserPreview(existingPlayer);
        return;
      }

      try {
        const userSnap = await getDoc(doc(db, "users", currentUserId));
        const user = userSnap.exists() ? (userSnap.data() as UserDoc) : null;

        setCurrentUserPreview({
          id: currentUserId,
          name: user?.username ?? "You",
          level: formatLevel(user?.rating ?? user?.level),
          avatar: user?.profilePhoto ?? null,
        });
      } catch {
        setCurrentUserPreview({
          id: currentUserId,
          name: "You",
          level: "-",
          avatar: null,
        });
      }
    };

    loadCurrentUserPreview().catch(() => {
      setCurrentUserPreview(
        currentUserId
          ? {
              id: currentUserId,
              name: "You",
              level: "-",
              avatar: null,
            }
          : null,
      );
    });
  }, [currentUserId, playerSlots]);

  useEffect(() => {
    setPendingSlotIndexes((current) =>
      current.filter((slot) => !playerSlots[slot]),
    );
  }, [playerSlots]);

  const isAlreadyJoined = useMemo(
    () =>
      Boolean(
        currentUserId &&
          match?.players?.some((playerId) => playerId === currentUserId),
      ),
    [currentUserId, match?.players],
  );

  const renderedPlayerSlots = useMemo(() => {
    const fallbackPreview =
      currentUserId && !currentUserPreview
        ? {
            id: currentUserId,
            name: "You",
            level: "-",
            avatar: null,
          }
        : null;

    return playerSlots.map((slot, index) => {
      if (slot) return slot;
      if (!pendingSlotIndexes.includes(index)) return null;
      return currentUserPreview ?? fallbackPreview;
    });
  }, [currentUserId, currentUserPreview, pendingSlotIndexes, playerSlots]);

  const onSlotPress = (slotIndex: number): SlotPressStatus => {
    if (playerSlots[slotIndex]) return "occupied";
    if (!currentUserId) return "sign_in_required";
    if (isAlreadyJoined) return "already_joined";

    setPendingSlotIndexes((current) =>
      current.includes(slotIndex)
        ? current.filter((slot) => slot !== slotIndex)
        : [...current, slotIndex].sort((a, b) => a - b),
    );

    return "ok";
  };

  const bookSelectedPlaces = async () => {
    if (!match) return "match_unavailable";

    setBookingBusy(true);

    try {
      const status = await bookMatchPlaces({
        matchId: match.id,
        currentUserId,
        requestedSlotIndexes: pendingSlotIndexes,
      });

      if (status === "success") {
        setPendingSlotIndexes([]);
        await refresh();
      }

      if (status === "already_joined" || status === "match_full") {
        setPendingSlotIndexes([]);
        await refresh();
      }

      if (status === "match_unavailable") {
        await refresh();
      }

      return status;
    } catch (error) {
      console.error(error);
      return "payment_failed";
    } finally {
      setBookingBusy(false);
    }
  };

  return {
    currentUserId,
    pendingSlotIndexes,
    renderedPlayerSlots,
    bookingBusy,
    onSlotPress,
    bookSelectedPlaces,
  };
};
