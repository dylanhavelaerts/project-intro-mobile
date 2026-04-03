/**
 * This file contains the `useBookCourtData` hook, which manages all data fetching and state related to the Book Court feature, including:
 * - Fetching and structuring location and court data for the Book Court list screen
 * - Fetching and persisting user's favorite locations
 * - Providing a toggle function for marking/unmarking favorite locations
 */

import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { auth } from "@/config/firebaseConfig";
import {
  fetchBookCourtListItems,
  fetchUserFavoriteLocationIds,
  persistUserFavoriteLocationIds,
} from "./bookCourtData";
import { BookCourtListItem } from "./types";

export const useBookCourtData = () => {
  const [loading, setLoading] = useState(true);
  const [courts, setCourts] = useState<BookCourtListItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const currentUser = auth.currentUser;
      const [courtItems, persistedFavorites] = await Promise.all([
        fetchBookCourtListItems(),
        currentUser
          ? fetchUserFavoriteLocationIds(currentUser.uid)
          : Promise.resolve([]),
      ]);

      setCourts(courtItems);
      setFavoriteIds(persistedFavorites);
    } catch (error) {
      console.error(error);
      setCourts([]);
      setFavoriteIds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load().catch((error) => {
      console.error(error);
      setLoading(false);
      setCourts([]);
      setFavoriteIds([]);
    });
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load().catch((error) => {
        console.error(error);
      });
    }, [load]),
  );

  const toggleFavorite = async (locationId: string) => {
    const previousFavoriteIds = favoriteIds;
    const nextFavorites = favoriteIds.includes(locationId)
      ? favoriteIds.filter((id) => id !== locationId)
      : [...favoriteIds, locationId];

    setFavoriteIds(nextFavorites);

    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      await persistUserFavoriteLocationIds(currentUser.uid, nextFavorites);
    } catch (error) {
      console.error(error);
      setFavoriteIds(previousFavoriteIds);
    }
  };

  return {
    loading,
    courts,
    favoriteIds,
    toggleFavorite,
  };
};
