import {
  BookCourtFilterCourt,
  BookCourtFiltersState,
  BookingTimeFilter,
  BookCourtSport,
} from "./types";

export const DEFAULT_BOOK_COURT_FILTERS: BookCourtFiltersState = {
  sport: "padel",
  selectedDate: new Date(),
  timeFilter: "all",
};

const pad2 = (value: number) => String(value).padStart(2, "0");

export const getSportLabel = (sport: BookCourtSport) =>
  sport === "tennis" ? "Tennis" : "Padel";

export const getDateLabel = (date: Date) => {
  const day = pad2(date.getDate());
  const month = date.toLocaleDateString("en-US", { month: "short" });
  return `${day} ${month}`;
};

export const getTimeFilterLabel = (timeFilter: BookingTimeFilter) => {
  if (timeFilter === "morning") return "Morning";
  if (timeFilter === "afternoon") return "Afternoon";
  if (timeFilter === "evening") return "Evening";
  return "All day";
};

const parseHourMinute = (value: string) => {
  const parts = value.trim().split(":").map(Number);
  if (parts.length !== 2 || parts.some((part) => Number.isNaN(part))) {
    return null;
  }

  return parts[0] * 60 + parts[1];
};

const parseOpeningHours = (openingHours?: string) => {
  if (!openingHours) return null;

  const [startText, endText] = openingHours.split("-");
  if (!startText || !endText) return null;

  const startMinute = parseHourMinute(startText);
  const endMinute = parseHourMinute(endText);

  if (startMinute == null || endMinute == null) return null;

  return { startMinute, endMinute };
};

const overlaps = (
  rangeA: { startMinute: number; endMinute: number },
  rangeB: { startMinute: number; endMinute: number },
) => {
  return (
    rangeA.startMinute < rangeB.endMinute &&
    rangeB.startMinute < rangeA.endMinute
  );
};

const matchesTimeWindow = (
  openingHours: string | undefined,
  timeFilter: BookingTimeFilter,
) => {
  if (timeFilter === "all") return true;

  const parsed = parseOpeningHours(openingHours);
  if (!parsed) return true;

  const wantedRange =
    timeFilter === "morning"
      ? { startMinute: 6 * 60, endMinute: 12 * 60 }
      : timeFilter === "afternoon"
        ? { startMinute: 12 * 60, endMinute: 18 * 60 }
        : { startMinute: 18 * 60, endMinute: 24 * 60 };

  return overlaps(parsed, wantedRange);
};

export const getFilteredCourts = <T extends BookCourtFilterCourt>(
  courts: T[],
  filters: BookCourtFiltersState,
) => {
  return courts.filter((court) => {
    if (court.sport !== filters.sport) return false;
    return matchesTimeWindow(court.openingHours, filters.timeFilter);
  });
};

export const getSelectableDates = (daysCount = 21) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: daysCount }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return date;
  });
};

export const dateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return `${year}-${month}-${day}`;
};
