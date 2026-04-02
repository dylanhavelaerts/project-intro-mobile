import type { VenueDay } from "../model/types";

const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));

export const toDateKeyLocal = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

export const parseHHMMToMinutes = (hhmm: string) => {
  const [h, m] = hhmm
    .trim()
    .split(":")
    .map((v) => Number(v));

  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
};

export const minutesToHHMM = (totalMinutes: number) => {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${pad2(h)}:${pad2(m)}`;
};

export const overlaps = (
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
) => aStart < bEnd && aEnd > bStart;

export const parseOpeningHours = (openingHours?: string | null) => {
  if (!openingHours) return { open: 8 * 60, close: 23 * 60 };

  const parts = openingHours.split("-");
  if (parts.length < 2) return { open: 8 * 60, close: 23 * 60 };

  const open = parseHHMMToMinutes(parts[0]);
  const close = parseHHMMToMinutes(parts[1]);

  return {
    open: open ?? 8 * 60,
    close: close ?? 23 * 60,
  };
};

export const generateDays = (count = 7): VenueDay[] => {
  const days: VenueDay[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setHours(0, 0, 0, 0);
    d.setDate(today.getDate() + i);

    days.push({
      day: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      date: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      fullDate: d,
    });
  }

  return days;
};
