import {
  ClubOption,
  EnrichedMatchData,
  FindMatchFiltersState,
  TimeFilter,
} from "../types";

export const DEFAULT_FIND_MATCH_FILTERS: FindMatchFiltersState = {
  sport: "padel",
  maxDistanceKm: 50,
  favoriteOnly: false,
  selectedWeekdays: [],
  timeFilter: "all",
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TIME_FILTER_LABELS: Record<TimeFilter, string> = {
  all: "All day",
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

const timeMatches = (minute: number | null, timeFilter: TimeFilter) => {
  if (timeFilter === "all" || minute == null) return true;

  if (timeFilter === "morning") return minute >= 6 * 60 && minute < 12 * 60;
  if (timeFilter === "afternoon") return minute >= 12 * 60 && minute < 18 * 60;
  return minute >= 18 * 60;
};

export const getFilteredMatches = (
  matches: EnrichedMatchData[],
  filters: FindMatchFiltersState,
  favoriteLocationIds: string[],
) => {
  return matches.filter((match) => {
    if (match.sport !== filters.sport) return false;

    if ((match.distanceKm ?? 999) > filters.maxDistanceKm) return false;

    if (
      filters.favoriteOnly &&
      (!match.locationId || !favoriteLocationIds.includes(match.locationId))
    ) {
      return false;
    }

    if (
      filters.selectedWeekdays.length > 0 &&
      !filters.selectedWeekdays.includes(match.weekday ?? -1)
    ) {
      return false;
    }

    return timeMatches(match.startMinute, filters.timeFilter);
  });
};

export const getVisibleClubCount = (
  clubs: ClubOption[],
  filters: FindMatchFiltersState,
  favoriteLocationIds: string[],
) => {
  return clubs.filter((club) => {
    if (club.sport !== filters.sport) return false;
    if (club.distanceKm > filters.maxDistanceKm) return false;

    if (filters.favoriteOnly && !favoriteLocationIds.includes(club.id)) {
      return false;
    }

    return true;
  }).length;
};

export const getWeekdayFilterLabel = (
  selectedWeekdays: number[],
  timeFilter: TimeFilter,
) => {
  if (selectedWeekdays.length === 0 && timeFilter === "all") {
    return "Any day";
  }

  const sorted = [...selectedWeekdays].sort((a, b) => a - b);
  const dayLabel =
    sorted.length === 0
      ? "Any day"
      : sorted.length <= 3
        ? sorted.map((day) => WEEKDAY_LABELS[day] ?? "").join("-")
        : `${sorted.length} days`;

  if (timeFilter === "all") return dayLabel;
  return `${dayLabel} · ${TIME_FILTER_LABELS[timeFilter]}`;
};

export const getSportFilterLabel = (sport: "padel" | "tennis") => {
  return sport === "tennis" ? "Tennis" : "Padel";
};
