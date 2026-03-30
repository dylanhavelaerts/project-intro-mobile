import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export type PlayerLevel = "Beginner" | "Intermediate" | "Pro";

// constants
const K = 0.3;
const RATING_MIN = 1.0;
const RATING_MAX = 7.0;

const LEVEL_BANDS: { min: number; max: number; label: PlayerLevel }[] = [
  { min: 1.0, max: 2.5, label: "Beginner" },
  { min: 2.5, max: 4.5, label: "Intermediate" },
  { min: 4.5, max: 7.0, label: "Pro" },
];

// Get label from numeric rating
export function getLevelLabel(rating: number): PlayerLevel {
  const band = LEVEL_BANDS.find((b) => rating >= b.min && rating < b.max);
  return band?.label ?? "Pro";
}

// Seed a numeric rating from an existing string level (one-time migration)
export function seedRatingFromLevel(level: string): number {
  switch (level) {
    case "Beginner":
      return 1.5;
    case "Intermediate":
      return 3.5;
    case "Pro":
      return 5.5;
    default:
      return 3.5;
  }
}
function calculateNewRating(
  playerRating: number,
  opponentRating: number,
  win: boolean,
): number {
  const normPlayer = (playerRating - 1) / 6;
  const normOpponent = (opponentRating - 1) / 6;
  const expected = 1 / (1 + Math.pow(10, (normOpponent - normPlayer) * 4));
  const delta = K * ((win ? 1 : 0) - expected);
  const newRating = Math.min(
    RATING_MAX,
    Math.max(RATING_MIN, playerRating + delta),
  );
  return parseFloat(newRating.toFixed(2));
}
// Call this after a match is completed
export async function recordMatchResult(
  winnerId: string,
  loserId: string,
  matchId?: string,
) {
  const winnerRef = doc(db, "users", winnerId);
  const loserRef = doc(db, "users", loserId);

  const [winnerSnap, loserSnap] = await Promise.all([
    getDoc(winnerRef),
    getDoc(loserRef),
  ]);

  const winnerData = winnerSnap.data();
  const loserData = loserSnap.data();

  // If user has no numeric rating yet, seed it from their existing level string
  const winnerRating =
    winnerData?.rating ?? seedRatingFromLevel(winnerData?.level);
  const loserRating =
    loserData?.rating ?? seedRatingFromLevel(loserData?.level);

  const newWinnerRating = calculateNewRating(winnerRating, loserRating, true);
  const newLoserRating = calculateNewRating(loserRating, winnerRating, false);

  await Promise.all([
    updateDoc(winnerRef, {
      rating: newWinnerRating,
      level: getLevelLabel(newWinnerRating),
    }),
    updateDoc(loserRef, {
      rating: newLoserRating,
      level: getLevelLabel(newLoserRating),
    }),
  ]);
  if (matchId) {
    const matchRef = doc(db, "matches", matchId);
    await updateDoc(matchRef, { status: "completed" });
  }
}
