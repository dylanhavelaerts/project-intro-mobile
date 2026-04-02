import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export type PlayerLevel = "Beginner" | "Intermediate" | "Pro";

export type SetScore = {
  team1: number;
  team2: number;
};

// ─── Constants ───────────────────────────────────────────
const K = 0.3;
const RATING_MIN = 1.0;
const RATING_MAX = 7.0;

const LEVEL_BANDS: { min: number; max: number; label: PlayerLevel }[] = [
  { min: 1.0, max: 2.5, label: "Beginner" },
  { min: 2.5, max: 4.5, label: "Intermediate" },
  { min: 4.5, max: 7.0, label: "Pro" },
];

// ─── Helpers ─────────────────────────────────────────────

export function getLevelLabel(rating: number): PlayerLevel {
  const band = LEVEL_BANDS.find((b) => rating >= b.min && rating < b.max);
  return band?.label ?? "Pro";
}

export function seedRatingFromLevel(level?: string | number): number {
  if (typeof level === "number" && Number.isFinite(level)) {
    return parseFloat(level.toFixed(2));
  }

  const normalized = String(level ?? "")
    .trim()
    .toLowerCase();

  switch (normalized) {
    case "Beginner":
    case "beginner":
      return 1.5;
    case "Intermediate":
    case "intermediate":
      return 3.5;
    case "Advanced":
    case "advanced":
    case "Pro":
    case "pro":
      return 5.5;
    default:
      return 1.5; // assignment says all new players start at 1.5
  }
}

// Validate a single set score according to assignment rules:
// Win = at least 6 points, 2 point difference (e.g. 6-4, 7-5)
export function isValidSet(score: SetScore): boolean {
  const { team1, team2 } = score;
  const high = Math.max(team1, team2);
  const low = Math.min(team1, team2);
  const diff = high - low;
  return high >= 6 && diff >= 2;
}

// Determine winner from best of 3 sets
// Returns 1 if team1 wins, 2 if team2 wins, null if invalid/incomplete
export function determineWinner(sets: SetScore[]): 1 | 2 | null {
  let team1Wins = 0;
  let team2Wins = 0;

  for (const set of sets) {
    if (!isValidSet(set)) return null;
    if (set.team1 > set.team2) team1Wins++;
    else team2Wins++;

    // First to win 2 sets wins the match
    if (team1Wins === 2) return 1;
    if (team2Wins === 2) return 2;
  }

  return null; // match not finished yet
}

// Core Elo calculation
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

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export async function recordDoublesMatchResult(
  winnerIds: string[],
  loserIds: string[],
  matchId?: string,
  competitive?: boolean,
) {
  if (winnerIds.length !== 2 || loserIds.length !== 2) {
    throw new Error("Doubles match requires exactly 2 winners and 2 losers.");
  }

  if (competitive) {
    const winnerRefs = winnerIds.map((id) => doc(db, "users", id));
    const loserRefs = loserIds.map((id) => doc(db, "users", id));
    const allRefs = [...winnerRefs, ...loserRefs];

    const snaps = await Promise.all(allRefs.map((ref) => getDoc(ref)));
    const winnerSnaps = snaps.slice(0, 2);
    const loserSnaps = snaps.slice(2);

    const winnerRatings = winnerSnaps.map((snap) => {
      const data = snap.data();
      return data?.rating ?? seedRatingFromLevel(data?.level);
    });

    const loserRatings = loserSnaps.map((snap) => {
      const data = snap.data();
      return data?.rating ?? seedRatingFromLevel(data?.level);
    });

    const winnerTeamRating = average(winnerRatings);
    const loserTeamRating = average(loserRatings);

    const newWinnerTeamRating = calculateNewRating(
      winnerTeamRating,
      loserTeamRating,
      true,
    );
    const newLoserTeamRating = calculateNewRating(
      loserTeamRating,
      winnerTeamRating,
      false,
    );

    const winnerDelta = parseFloat(
      (newWinnerTeamRating - winnerTeamRating).toFixed(2),
    );
    const loserDelta = parseFloat(
      (newLoserTeamRating - loserTeamRating).toFixed(2),
    );

    const winnerUpdates = winnerRatings.map((rating) => {
      const next = Math.min(
        RATING_MAX,
        Math.max(RATING_MIN, rating + winnerDelta),
      );
      return parseFloat(next.toFixed(2));
    });

    const loserUpdates = loserRatings.map((rating) => {
      const next = Math.min(
        RATING_MAX,
        Math.max(RATING_MIN, rating + loserDelta),
      );
      return parseFloat(next.toFixed(2));
    });

    await Promise.all([
      ...winnerRefs.map((ref, i) =>
        updateDoc(ref, {
          rating: winnerUpdates[i],
          level: winnerUpdates[i],
        }),
      ),
      ...loserRefs.map((ref, i) =>
        updateDoc(ref, {
          rating: loserUpdates[i],
          level: loserUpdates[i],
        }),
      ),
    ]);
  }

  if (matchId) {
    const matchRef = doc(db, "matches", matchId);
    await updateDoc(matchRef, { status: "completed" });
  }
}

// ─── Main function ────────────────────────────────────────

export async function recordMatchResult(
  winnerId: string,
  loserId: string,
  matchId?: string,
  competitive?: boolean, // only adjust ratings for competitive matches
) {
  // Only update ratings if the match was competitive
  if (competitive) {
    const winnerRef = doc(db, "users", winnerId);
    const loserRef = doc(db, "users", loserId);

    const [winnerSnap, loserSnap] = await Promise.all([
      getDoc(winnerRef),
      getDoc(loserRef),
    ]);

    const winnerData = winnerSnap.data();
    const loserData = loserSnap.data();

    const winnerRating =
      winnerData?.rating ?? seedRatingFromLevel(winnerData?.level);
    const loserRating =
      loserData?.rating ?? seedRatingFromLevel(loserData?.level);

    const newWinnerRating = calculateNewRating(winnerRating, loserRating, true);
    const newLoserRating = calculateNewRating(loserRating, winnerRating, false);

    await Promise.all([
      updateDoc(winnerRef, {
        rating: newWinnerRating,
        level: newWinnerRating,
      }),
      updateDoc(loserRef, {
        rating: newLoserRating,
        level: newLoserRating,
      }),
    ]);
  }

  // Always mark the match as completed
  if (matchId) {
    const matchRef = doc(db, "matches", matchId);
    await updateDoc(matchRef, { status: "completed" });
  }
}
