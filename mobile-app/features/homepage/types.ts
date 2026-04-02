export type SuggestedClub = {
  id: string;
  name: string;
  city: string;
  imageUrl?: string;
  distanceKm: number;
  openMatches: number;
  tournaments: number;
  classes: number;
};

export type FirestoreMatch = {
  id: string;
  locationId?: string;
  status?: "open" | "full" | "completed" | "cancelled";
};

export type FirestoreLocation = {
  name?: string;
  city?: string;
  imageUrl?: string;
};

export type FirestoreUser = {
  city?: string;
};
