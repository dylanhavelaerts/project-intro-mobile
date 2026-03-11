export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  imageUrl: string;
  sport: string;
  openingHours: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
}

export interface Court {
  id: string;
  locationId: string;
  name: string;
  surface: "artificial_grass" | "clay" | "hard";
  type: "indoor" | "outdoor";
  pricePerSlot: number;
  slotDurationMinutes: number;
  isFavorite: boolean;
}

export interface Match {
  id: string;
  courtId: string;
  locationId: string;
  createdBy: string;
  dateTime: Date;
  levelRange: { min: number; max: number };
  mixed: boolean;
  competitive: boolean;
  status: "open" | "full" | "completed" | "cancelled";
  players: string[];
  pricePerPlayer: number;
  result: {
    team1: number[];
    team2: number[];
  } | null;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  level: number;
}
