import { PlayerView } from "./types";

// ------------------------------------------------------------
// INTERNAL HELPERS
// ------------------------------------------------------------
const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));

const parseDateKey = (dateKey?: string) => {
  if (!dateKey) return null;
  const [year, month, day] = dateKey.split("-").map((v) => Number(v));
  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
};

// ------------------------------------------------------------
// UI FORMATTERS
// ------------------------------------------------------------
export const minutesToHHMM = (totalMinutes?: number) => {
  if (!Number.isFinite(totalMinutes)) return "--:--";
  const safe = Number(totalMinutes);
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${pad2(h)}:${pad2(m)}`;
};

export const formatLevel = (level?: string | number) => {
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

export const formatPrice = (value?: number) => {
  if (!Number.isFinite(value)) return "€ 0";
  const n = Number(value);
  return Number.isInteger(n) ? `€ ${n}` : `€ ${n.toFixed(2)}`;
};

// ------------------------------------------------------------
// DERIVED VALUES
// ------------------------------------------------------------
export const buildTimeLabel = (
  dateKey?: string,
  startMinute?: number,
  durationMinutes?: number,
) => {
  const start = startMinute ?? 0;
  const end = start + (durationMinutes ?? 90);
  const date = parseDateKey(dateKey);

  const dayLabel = date
    ? date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      })
    : "Unknown date";

  return `${dayLabel} ${minutesToHHMM(start)} - ${minutesToHHMM(end)}`;
};

export const buildPlayerSlots = (players: PlayerView[]) => {
  const slots: (PlayerView | null)[] = [null, null, null, null];
  players.slice(0, 4).forEach((player, index) => {
    slots[index] = player;
  });
  return slots;
};
