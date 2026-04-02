/**
 * This file contains selector functions for the Book Court feature, responsible for deriving and transforming data 
 * for the Book Court list screen based on the current state of courts, filters, and user preferences.
 */

import { getFilteredCourts } from "./filters/filterUtils";
import { GetVisibleBookCourtsParams } from "./types";

export const getVisibleBookCourts = ({
  courts,
  filters,
  favoriteIds,
  activeIcon,
}: GetVisibleBookCourtsParams) => {
  const filtered = getFilteredCourts(courts, filters);

  return filtered
    .map((court) => ({
      ...court,
      isFavorite: favoriteIds.includes(court.id),
    }))
    .filter((court) => (activeIcon === "heart" ? court.isFavorite : true));
};
