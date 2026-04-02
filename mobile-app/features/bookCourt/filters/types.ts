export type BookCourtSport = "padel" | "tennis";

export type BookingTimeFilter = "all" | "morning" | "afternoon" | "evening";

export type BookCourtFiltersState = {
  sport: BookCourtSport;
  selectedDate: Date;
  timeFilter: BookingTimeFilter;
};

export type BookCourtFilterCourt = {
  id: string;
  sport: BookCourtSport;
  openingHours?: string;
};
