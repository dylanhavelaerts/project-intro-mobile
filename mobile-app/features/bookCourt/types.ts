import { CourtData } from "@/components/CourtCard";
import { BookCourtFiltersState, BookCourtSport } from "./filters/types";

export type BookCourtListItem = CourtData & {
  sport: BookCourtSport;
  openingHours?: string;
};

export type BookCourtRawLocation = {
  name?: string;
  imageUrl?: string;
  city?: string;
  address?: string;
  sport?: string;
  openingHours?: string;
};

export type BookCourtRawCourt = {
  locationId?: string;
  pricePerSlot?: number;
  slotDurationMinutes?: number;
};

export type BookCourtIconFilter = "location" | "heart";

export type GetVisibleBookCourtsParams = {
  courts: BookCourtListItem[];
  filters: BookCourtFiltersState;
  favoriteIds: string[];
  activeIcon: BookCourtIconFilter;
};
