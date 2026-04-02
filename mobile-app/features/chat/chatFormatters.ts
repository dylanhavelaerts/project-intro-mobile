const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));

export const minutesToHHMM = (totalMinutes?: number) => {
  if (!Number.isFinite(totalMinutes)) return "--:--";
  const safe = Number(totalMinutes);
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${pad2(h)}:${pad2(m)}`;
};

export const formatDateLabel = (dateKey?: string) => {
  if (!dateKey) return "Unknown date";

  const [year, month, day] = dateKey.split("-").map((v) => Number(v));
  if (!year || !month || !day) return "Unknown date";

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  const today = new Date();
  const isToday =
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate();

  if (isToday) return "Today";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
};
