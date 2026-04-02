/**
 * Custom hook for fetching and managing suggested clubs based on user's location and open matches.
 * - Fetches open matches from Firestore and counts them by location
 * - Fetches location details for those with open matches
 * - Estimates distance from user's city to club's city
 * - Sorts clubs by distance and number of open matches, and limits to top 3 suggestions
 */

import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import { estimateDistanceKmByCity } from "@/features/findMatch/matchMappers";
import { FirestoreLocation, FirestoreMatch, FirestoreUser, SuggestedClub } from "./types";

const DEFAULT_CITY = "Antwerp";

export const useSuggestedClubs = () => {
  const [clubs, setClubs] = useState<SuggestedClub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSuggestedClubs = async () => {
      setLoading(true);

      try {
        const currentUser = auth.currentUser;
        const currentUserSnap = currentUser
          ? await getDoc(doc(db, "users", currentUser.uid))
          : null;
        const currentUserData = currentUserSnap?.exists()
          ? (currentUserSnap.data() as FirestoreUser)
          : null;

        const userCity = currentUserData?.city?.trim().length
          ? currentUserData.city.trim()
          : DEFAULT_CITY;

        const matchesSnap = await getDocs(
          query(collection(db, "matches"), where("status", "in", ["open", "full"])),
        );

        const openMatchesByLocation = new Map<string, number>();

        matchesSnap.docs.forEach((matchDoc) => {
          const match = {
            id: matchDoc.id,
            ...(matchDoc.data() as Omit<FirestoreMatch, "id">),
          };

          if (!match.locationId) return;
          openMatchesByLocation.set(
            match.locationId,
            (openMatchesByLocation.get(match.locationId) ?? 0) + 1,
          );
        });

        const locationIds = Array.from(openMatchesByLocation.keys());

        if (locationIds.length === 0) {
          setClubs([]);
          return;
        }

        const locationEntries = await Promise.all(
          locationIds.map(async (locationId) => {
            const locationSnap = await getDoc(doc(db, "locations", locationId));
            return [
              locationId,
              locationSnap.exists() ? (locationSnap.data() as FirestoreLocation) : null,
            ] as const;
          }),
        );

        const suggested = locationEntries
          .map(([id, location]) => {
            if (!location) return null;

            const city = location.city?.trim() || "Unknown city";
            return {
              id,
              name: location.name?.trim() || "Unknown club",
              city,
              imageUrl: location.imageUrl,
              distanceKm: estimateDistanceKmByCity(city, userCity),
              openMatches: openMatchesByLocation.get(id) ?? 0,
              tournaments: 0,
              classes: 0,
            } as SuggestedClub;
          })
          .filter((club): club is SuggestedClub => Boolean(club))
          .sort((a, b) => {
            if (a.distanceKm !== b.distanceKm) return a.distanceKm - b.distanceKm;
            return b.openMatches - a.openMatches;
          })
          .slice(0, 3);

        setClubs(suggested);
      } catch (error) {
        console.error(error);
        setClubs([]);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestedClubs().catch((error) => {
      console.error(error);
      setLoading(false);
      setClubs([]);
    });
  }, []);

  return { clubs, loading };
};
