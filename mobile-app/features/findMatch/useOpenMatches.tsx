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
import { auth, db } from "@/config/firebaseConfig";
import {
  estimateDistanceKmByCity,
  mapFirestoreMatchToCard,
  sortMatches,
} from "./matchMappers";
import {
  ClubOption,
  EnrichedMatchData,
  FirestoreCourt,
  FirestoreLocation,
  FirestoreMatch,
  FirestoreUser,
} from "./types";

type UseOpenMatchesResult = {
  matches: EnrichedMatchData[];
  clubs: ClubOption[];
  favoriteLocationIds: string[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export const useOpenMatches = (): UseOpenMatchesResult => {
  // ------------------------------------------------------------
  // LOCAL STATE
  // ------------------------------------------------------------
  const [matches, setMatches] = useState<EnrichedMatchData[]>([]);
  const [clubs, setClubs] = useState<ClubOption[]>([]);
  const [favoriteLocationIds, setFavoriteLocationIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ------------------------------------------------------------
  // DATA FETCHING
  // ------------------------------------------------------------
  const fetchOpenMatches = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const currentUser = auth.currentUser;
      const currentUserSnap = currentUser
        ? await getDoc(doc(db, "users", currentUser.uid))
        : null;
      const currentUserData = currentUserSnap?.exists()
        ? (currentUserSnap.data() as FirestoreUser)
        : null;
      const currentUserCity = currentUserData?.city?.trim().length
        ? currentUserData.city.trim()
        : "Antwerp";
      const persistedFavorites = Array.isArray(
        currentUserData?.favoriteLocationIds,
      )
        ? currentUserData.favoriteLocationIds
        : Array.isArray(currentUserData?.favouriteLocationIds)
          ? currentUserData.favouriteLocationIds
          : [];

      setFavoriteLocationIds(
        persistedFavorites.filter((id): id is string => typeof id === "string"),
      );

      const matchesSnap = await getDocs(
        query(
          collection(db, "matches"),
          where("status", "in", ["open", "full"]),
        ),
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
        setClubs([]);
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
            .flatMap((m) => [
              m.createdBy,
              ...(Array.isArray(m.players) ? m.players : []),
            ])
            .filter(
              (id): id is string => typeof id === "string" && id.length > 0,
            ),
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

      const mappedMatches = rawMatches.map((match) =>
        mapFirestoreMatchToCard(match, lookups, currentUserCity),
      );

      const allClubs = locationEntries
        .filter(([, location]): location is FirestoreLocation =>
          Boolean(location),
        )
        .map(([id, location]) => ({
          id,
          name: location.name ?? "Unknown club",
          city: location.city ?? "Unknown city",
          distanceKm: estimateDistanceKmByCity(location.city, currentUserCity),
          sport:
            location.sport?.toLowerCase() === "tennis" ? "tennis" : "padel",
        }));

      setMatches(mappedMatches);
      setClubs(allClubs.sort((a, b) => a.distanceKm - b.distanceKm));
    } catch (e) {
      console.error(e);
      setError("Could not load matches right now.");
      setMatches([]);
      setClubs([]);
      setFavoriteLocationIds([]);
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

  return {
    matches,
    clubs,
    favoriteLocationIds,
    loading,
    error,
    refresh: fetchOpenMatches,
  };
};
