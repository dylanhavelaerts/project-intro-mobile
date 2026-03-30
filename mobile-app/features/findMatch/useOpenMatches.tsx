import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { MatchData } from "@/components/MatchCard";
import { db } from "@/config/firebaseConfig";
import { mapFirestoreMatchToCard, sortMatches } from "./matchMappers";
import {
  FirestoreCourt,
  FirestoreLocation,
  FirestoreMatch,
  FirestoreUser,
} from "./types";

type UseOpenMatchesResult = {
  matches: MatchData[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export const useOpenMatches = (): UseOpenMatchesResult => {
  // ------------------------------------------------------------
  // LOCAL STATE
  // ------------------------------------------------------------
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ------------------------------------------------------------
  // DATA FETCHING
  // ------------------------------------------------------------
  const fetchOpenMatches = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const matchesSnap = await getDocs(
        query(collection(db, "matches"), where("status", "==", "open")),
      );

      // Map raw Firestore documents to typed objects and sort them
      const rawMatches: FirestoreMatch[] = matchesSnap.docs
        .map((matchDoc) => ({
          id: matchDoc.id,
          ...(matchDoc.data() as Omit<FirestoreMatch, "id">),
        }))
        .sort(sortMatches);

      if (rawMatches.length === 0) {
        setMatches([]);
        return;
      }

      // Get unique location, court, and user ids from the matches
      const locationIds = Array.from(
        new Set(
          rawMatches.map((m) => m.locationId).filter(Boolean) as string[],
        ),
      );
      const courtIds = Array.from(
        new Set(rawMatches.map((m) => m.courtId).filter(Boolean) as string[]),
      );
      const userIds = Array.from(
        new Set(
          rawMatches
            .flatMap((m) => (Array.isArray(m.players) ? m.players : []))
            .filter(Boolean),
        ),
      );

      // Fetch all related locations, courts, and users in parallel
      const [locationEntries, courtEntries, userEntries] = await Promise.all([
        Promise.all(
          locationIds.map(async (id) => {
            const snap = await getDoc(doc(db, "locations", id));
            return [
              id,
              snap.exists() ? (snap.data() as FirestoreLocation) : null,
            ] as const;
          }),
        ),
        Promise.all(
          courtIds.map(async (id) => {
            const snap = await getDoc(doc(db, "courts", id));
            return [
              id,
              snap.exists() ? (snap.data() as FirestoreCourt) : null,
            ] as const;
          }),
        ),
        Promise.all(
          userIds.map(async (id) => {
            const snap = await getDoc(doc(db, "users", id));
            return [
              id,
              snap.exists() ? (snap.data() as FirestoreUser) : null,
            ] as const;
          }),
        ),
      ]);

      // Create lookup maps for locations, courts, and users
      const lookups = {
        locationsById: new Map(locationEntries),
        courtsById: new Map(courtEntries),
        usersById: new Map(userEntries),
      };

      setMatches(
        rawMatches.map((match) => mapFirestoreMatchToCard(match, lookups)),
      );
    } catch (e) {
      console.error(e);
      setError("Could not load matches right now.");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ------------------------------------------------------------
  // REFRESH ON SCREEN FOCUS
  // ------------------------------------------------------------
  useFocusEffect(
    useCallback(() => {
      fetchOpenMatches().catch((e) => {
        console.error(e);
      });
    }, [fetchOpenMatches]),
  );

  return { matches, loading, error, refresh: fetchOpenMatches };
};
