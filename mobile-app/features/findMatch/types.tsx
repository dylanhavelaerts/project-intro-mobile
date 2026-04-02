import { MatchData } from "@/components/MatchCard";

// ------------------------------------------------------------
// FIRESTORE DOCUMENT TYPES
// ------------------------------------------------------------
export type MatchSport = "padel" | "tennis";

export type FirestoreMatch = {
  id: string;
  locationId?: string;
  courtId?: string | null;
  dateKey?: string;
  startMinute?: number;
  durationMinutes?: number;
  createdBy?: string;
  status?: "open" | "full" | "completed" | "cancelled";
  players?: (string | null)[];
  playerNames?: string[];
  levelMin?: number;
  levelMax?: number;
  competitive?: boolean;
  pricePerPlayer?: number;
};

export type FirestoreLocation = {
  name?: string;
  city?: string;
  sport?: string;
};

export type FirestoreCourt = {
  name?: string;
};

export type FirestoreUser = {
  username?: string;
  level?: string | number;
  sport?: string;
  city?: string;
  favoriteLocationIds?: string[];
  favouriteLocationIds?: string[];
};

// ------------------------------------------------------------
// LOOKUP MAPS
// ------------------------------------------------------------

/**
 * Lookup maps for related documents to avoid repeated lookups when mapping matches to UI data.
 * Each map is keyed by the document ID and maps to the corresponding Firestore document data or null if not found.
 */
export type MatchLookupMaps = {
  locationsById: Map<string, FirestoreLocation | null>;
  courtsById: Map<string, FirestoreCourt | null>;
  usersById: Map<string, FirestoreUser | null>;
};

export type EnrichedMatchData = MatchData & {
  sport: MatchSport;
  locationId: string | null;
  locationName: string;
  city: string;
  weekday: number | null;
  startMinute: number | null;
  distanceKm: number | null;
};

export type ClubOption = {
  id: string;
  name: string;
  city: string;
  distanceKm: number;
  sport: MatchSport;
};

export type TimeFilter = "all" | "morning" | "afternoon" | "evening";

export type FindMatchFiltersState = {
  sport: MatchSport;
  maxDistanceKm: number;
  favoriteOnly: boolean;
  selectedWeekdays: number[];
  timeFilter: TimeFilter;
};
