// ------------------------------------------------------------
// FIRESTORE DOCUMENT TYPES
// ------------------------------------------------------------
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
};

export type FirestoreCourt = {
  name?: string;
};

export type FirestoreUser = {
  username?: string;
  level?: string | number;
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
