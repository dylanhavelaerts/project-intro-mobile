import { MatchData } from "@/components/MatchCard";
import { FirestoreMatch, MatchLookupMaps } from "./types";

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
  return String(level).replace(".", ",");
};

const formatPrice = (pricePerPlayer?: number) => {
  if (!Number.isFinite(pricePerPlayer)) return "€ 0";

  const value = Number(pricePerPlayer);
  return Number.isInteger(value) ? `€ ${value}` : `€ ${value.toFixed(2)}`;
};

// ------------------------------------------------------------
// MAPPERS
// ------------------------------------------------------------
export const mapFirestoreMatchToCard = (
  match: FirestoreMatch,
  lookups: MatchLookupMaps,
): MatchData => {
  // Get related location and court data using lookup maps
  const location = match.locationId
    ? lookups.locationsById.get(match.locationId)
    : undefined;
  const court = match.courtId
    ? lookups.courtsById.get(match.courtId)
    : undefined;

  const players = Array.from({ length: 4 }, (_, index) => {
    const userId = match.players?.[index];
    if (!userId) return null;

    const user = lookups.usersById.get(userId);
    return {
      name: user?.username ?? "Player",
      rating: formatLevel(user?.level),
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
    distance: "N/A",
    location: location?.city ?? location?.name ?? "Unknown location",
    price: formatPrice(match.pricePerPlayer),
    duration: `${match.durationMinutes ?? 90}min`,
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
