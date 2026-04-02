/**
 * This file contains all mapping and formatting logic related to the Find Match feature, including:
 * - Mapping Firestore match documents to enriched data structures optimized for UI display in match cards
 * - Formatting of dates, times, levels, and prices for display
 * - Estimating distances based on city names when geolocation data is not available
 * - Sorting logic for ordering matches by date and time
 */

import {
  EnrichedMatchData,
  FirestoreMatch,
  MatchLookupMaps,
  MatchSport,
} from "./types";

// ------------------------------------------------------------
// INTERNAL FORMATTERS
// ------------------------------------------------------------
const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));

const minutesToHHMM = (totalMinutes?: number) => {
  if (!Number.isFinite(totalMinutes)) return "--:--";

  const safeMinutes = Number(totalMinutes);
  const h = Math.floor(safeMinutes / 60);
  const m = safeMinutes % 60;
  return `${pad2(h)}:${pad2(m)}`;
};

const dateLabelFromDateKey = (dateKey?: string) => {
  if (!dateKey) return "Unknown date";

  const [year, month, day] = dateKey.split("-").map((value) => Number(value));
  if (!year || !month || !day) return "Unknown date";

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
};

const formatLevel = (level?: string | number) => {
  if (level === undefined || level === null || level === "") return "-";

  if (typeof level === "number" && Number.isFinite(level)) {
    return level.toFixed(1);
  }

  const numeric = Number(level);
  if (Number.isFinite(numeric)) {
    return numeric.toFixed(1);
  }

  const normalized = String(level).toLowerCase().trim();
  if (normalized === "beginner") return "1.5";
  if (normalized === "intermediate") return "3.5";
  if (normalized === "advanced" || normalized === "pro") return "5.5";

  return "-";
};

const formatPrice = (pricePerPlayer?: number) => {
  if (!Number.isFinite(pricePerPlayer)) return "€ 0";

  const value = Number(pricePerPlayer);
  return Number.isInteger(value) ? `€ ${value}` : `€ ${value.toFixed(2)}`;
};

const normalizeSport = (value?: string): MatchSport => {
  return value?.toLowerCase() === "tennis" ? "tennis" : "padel";
};

const weekdayFromDateKey = (dateKey?: string) => {
  if (!dateKey) return null;

  const [year, month, day] = dateKey.split("-").map((value) => Number(value));
  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;
  return date.getDay();
};

const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  antwerp: { lat: 51.2194, lon: 4.4025 },
  brussels: { lat: 50.8503, lon: 4.3517 },
  ghent: { lat: 51.0543, lon: 3.7174 },
  mechelen: { lat: 51.0259, lon: 4.4775 },
  leuven: { lat: 50.8798, lon: 4.7005 },
};

const toRadians = (value: number) => (value * Math.PI) / 180;

const haversineDistanceKm = (
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
) => {
  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lon - a.lon);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

export const estimateDistanceKmByCity = (
  city: string | undefined,
  userCity: string,
) => {
  if (!city) return 999;

  const normalizedCity = city.toLowerCase().trim();
  const normalizedUserCity = userCity.toLowerCase().trim();
  if (normalizedCity === normalizedUserCity) return 2;

  const cityCoords = CITY_COORDS[normalizedCity];
  const userCoords = CITY_COORDS[normalizedUserCity];

  if (cityCoords && userCoords) {
    return Math.round(haversineDistanceKm(userCoords, cityCoords));
  }

  return 30;
};

// ------------------------------------------------------------
// MAPPERS
// ------------------------------------------------------------
export const mapFirestoreMatchToCard = (
  match: FirestoreMatch,
  lookups: MatchLookupMaps,
  userCity: string,
): EnrichedMatchData => {
  // Get related location and court data using lookup maps
  const location = match.locationId
    ? lookups.locationsById.get(match.locationId)
    : undefined;
  const court = match.courtId
    ? lookups.courtsById.get(match.courtId)
    : undefined;
  const creator = match.createdBy
    ? lookups.usersById.get(match.createdBy)
    : undefined;

  const locationName = location?.name ?? "Unknown location";
  const city = location?.city ?? locationName;
  const distanceKm = estimateDistanceKmByCity(city, userCity);

  const players = Array.from({ length: 4 }, (_, index) => {
    const userId = match.players?.[index];
    if (!userId) return null;

    const user = lookups.usersById.get(userId);
    return {
      name: user?.username ?? "Player",
      rating: formatLevel(user?.rating ?? user?.level),
      avatar: null,
    };
  });

  return {
    id: match.id,
    date: dateLabelFromDateKey(match.dateKey),
    time: minutesToHHMM(match.startMinute),
    type: match.competitive ? "Competitive" : "Friendly",
    levelRange: `${match.levelMin ?? "-"} - ${match.levelMax ?? "-"}`,
    players,
    court: court?.name ?? "Open court",
    distance: `${distanceKm}km`,
    location: city,
    price: formatPrice(match.pricePerPlayer),
    duration: `${match.durationMinutes ?? 90}min`,
    sport: normalizeSport(creator?.sport ?? location?.sport),
    locationId: match.locationId ?? null,
    locationName,
    city,
    weekday: weekdayFromDateKey(match.dateKey),
    startMinute:
      typeof match.startMinute === "number" ? match.startMinute : null,
    distanceKm,
  };
};

// ------------------------------------------------------------
// SORTING
// ------------------------------------------------------------
export const sortMatches = (a: FirestoreMatch, b: FirestoreMatch) => {
  const dateCompare = (a.dateKey ?? "").localeCompare(b.dateKey ?? "");
  if (dateCompare !== 0) return dateCompare;
  return (a.startMinute ?? 0) - (b.startMinute ?? 0);
};
