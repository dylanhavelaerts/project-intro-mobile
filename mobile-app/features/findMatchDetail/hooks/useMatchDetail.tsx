/**
 * Hook for loading and managing match detail data, including match info, location, court, and players.
 * Handles loading state, errors, and provides a refresh function.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { buildTimeLabel, formatLevel } from "../model/matchDetailFormatters";
import {
  CourtDoc,
  LocationDoc,
  MatchDoc,
  PlayerView,
  UserDoc,
} from "../model/types";

type BookingDoc = {
  courtId?: string;
  locationId?: string;
  dateKey?: string;
  startMinute?: number;
  status?: "confirmed" | "cancelled";
};

// ------------------------------------------------------------
// RETURN TYPE
// ------------------------------------------------------------
type UseMatchDetailResult = {
  loading: boolean;
  error: string | null;
  match: MatchDoc | null;
  location: LocationDoc | null;
  court: CourtDoc | null;
  players: PlayerView[];
  playerSlots: (PlayerView | null)[];
  placesLeft: number;
  timeLabel: string;
  refresh: () => Promise<void>;
};

// ------------------------------------------------------------
// HOOK
// ------------------------------------------------------------
export const useMatchDetail = (matchId?: string): UseMatchDetailResult => {
  // ------------------------------------------------------------
  // LOCAL STATE
  // ------------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [match, setMatch] = useState<MatchDoc | null>(null);
  const [location, setLocation] = useState<LocationDoc | null>(null);
  const [court, setCourt] = useState<CourtDoc | null>(null);
  const [players, setPlayers] = useState<PlayerView[]>([]);
  const [playerSlots, setPlayerSlots] = useState<(PlayerView | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  // ------------------------------------------------------------
  // LOAD MATCH DETAIL DATA
  // ------------------------------------------------------------
  const load = useCallback(async () => {
    if (!matchId) {
      setError("No match id provided.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const matchSnap = await getDoc(doc(db, "matches", matchId));
      if (!matchSnap.exists()) {
        setError("Match not found.");
        setLoading(false);
        return;
      }

      const rawMatch: MatchDoc = {
        id: matchSnap.id,
        ...(matchSnap.data() as Omit<MatchDoc, "id">),
      };

      setMatch(rawMatch);

      let resolvedCourtId: string | null = rawMatch.courtId ?? null;

      if (
        !resolvedCourtId &&
        rawMatch.locationId &&
        rawMatch.dateKey &&
        Number.isFinite(rawMatch.startMinute)
      ) {
        const bookingSnap = await getDocs(
          query(
            collection(db, "bookings"),
            where("locationId", "==", rawMatch.locationId),
            where("dateKey", "==", rawMatch.dateKey),
            where("startMinute", "==", rawMatch.startMinute),
            where("status", "==", "confirmed"),
          ),
        );

        const booking = bookingSnap.docs[0]?.data() as BookingDoc | undefined;
        resolvedCourtId = booking?.courtId ?? null;
      }

      const [locationSnap, courtSnap] = await Promise.all([
        rawMatch.locationId
          ? getDoc(doc(db, "locations", rawMatch.locationId))
          : Promise.resolve(null),
        resolvedCourtId
          ? getDoc(doc(db, "courts", resolvedCourtId))
          : Promise.resolve(null),
      ]);

      setLocation(
        locationSnap && locationSnap.exists()
          ? (locationSnap.data() as LocationDoc)
          : null,
      );
      setCourt(
        courtSnap && courtSnap.exists() ? (courtSnap.data() as CourtDoc) : null,
      );

      const slotIds = Array.from({ length: 4 }, (_, index) => {
        const value = rawMatch.players?.[index];
        return typeof value === "string" && value.trim().length > 0
          ? value
          : null;
      });

      const uniqueIds = Array.from(
        new Set(slotIds.filter((id): id is string => Boolean(id))),
      );

      if (uniqueIds.length === 0) {
        setPlayers([]);
        setPlayerSlots([null, null, null, null]);
        return;
      }

      const userSnaps = await Promise.all(
        uniqueIds.map((uid) => getDoc(doc(db, "users", uid))),
      );

      const usersById = new Map<string, UserDoc | null>(
        userSnaps.map((snap, idx) => [
          uniqueIds[idx],
          snap.exists() ? (snap.data() as UserDoc) : null,
        ]),
      );

      const resolvedSlots = slotIds.map((uid) => {
        if (!uid) return null;

        const user = usersById.get(uid);
        return {
          id: uid,
          name: user?.username ?? "Player",
          level: formatLevel(user?.rating ?? user?.level),
          avatar: user?.profilePhoto ?? null,
        };
      });

      setPlayerSlots(resolvedSlots);
      setPlayers(
        resolvedSlots.filter((player): player is PlayerView => Boolean(player)),
      );
    } catch (e) {
      console.error(e);
      setError("Could not load match details.");
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    load().catch((e) => {
      console.error(e);
      setError("Could not load match details.");
      setLoading(false);
    });
  }, [load]);

  // ------------------------------------------------------------
  // DERIVED UI VALUES
  // ------------------------------------------------------------
  const placesLeft = useMemo(
    () => Math.max(0, 4 - playerSlots.filter(Boolean).length),
    [playerSlots],
  );
  const timeLabel = useMemo(
    () =>
      buildTimeLabel(
        match?.dateKey,
        match?.startMinute,
        match?.durationMinutes,
      ),
    [match?.dateKey, match?.startMinute, match?.durationMinutes],
  );

  return {
    loading,
    error,
    match,
    location,
    court,
    players,
    playerSlots,
    placesLeft,
    timeLabel,
    refresh: load,
  };
};
