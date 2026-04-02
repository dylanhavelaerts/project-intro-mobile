import type { Court, Location } from "@/types";

export type MatchTab = "Home" | "Book" | "Open Matches" | "Competitions";

export type DurationMinutes = 60 | 90 | 120;

export type Booking = {
  id: string;
  locationId: string;
  courtId: string;
  dateKey: string;
  startMinute: number;
  endMinute: number;
  durationMinutes: DurationMinutes;
  status: "confirmed" | "cancelled";
};

export type MatchDoc = {
  id: string;
  locationId: string;
  courtId: string | null;
  dateKey: string;
  startMinute: number;
  durationMinutes: DurationMinutes;
  createdBy: string;
  players: string[];
  playerNames: string[];
  levelMin: number;
  levelMax: number;
  mixed: boolean;
  competitive: boolean;
  status: "open" | "full" | "completed" | "cancelled";
  pricePerPlayer: number;
  createdAt?: unknown;
};

export type VenueDay = {
  day: string;
  date: number;
  month: string;
  fullDate: Date;
};

export type VenueDetails = {
  location: Location | null;
  courts: Court[];
};
