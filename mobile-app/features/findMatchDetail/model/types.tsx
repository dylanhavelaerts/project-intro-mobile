// ------------------------------------------------------------
// MATCH DATA TYPES
// ------------------------------------------------------------
export type MatchDoc = {
  id: string;
  locationId?: string;
  courtId?: string | null;
  dateKey?: string;
  startMinute?: number;
  durationMinutes?: number;
  createdBy?: string;
  players?: (string | null)[];
  playerNames?: string[];
  levelMin?: number;
  levelMax?: number;
  mixed?: boolean;
  competitive?: boolean;
  status?: "open" | "full" | "completed" | "cancelled";
  pricePerPlayer?: number;
};

// ------------------------------------------------------------
// RELATED DOCUMENT TYPES
// ------------------------------------------------------------
export type LocationDoc = {
  name?: string;
  address?: string;
  city?: string;
  imageUrl?: string;
};

export type CourtDoc = {
  name?: string;
  type?: string;
  surface?: string;
};

export type UserDoc = {
  username?: string;
  level?: string | number;
  rating?: number;
  profilePhoto?: string | null;
};

// ------------------------------------------------------------
// UI VIEW TYPES
// ------------------------------------------------------------
export type PlayerView = {
  id: string;
  name: string;
  level: string;
  avatar: string | null;
};
