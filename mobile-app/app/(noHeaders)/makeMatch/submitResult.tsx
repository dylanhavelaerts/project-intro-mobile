import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  recordDoublesMatchResult,
  determineWinner,
  isValidSet,
} from "../../../config/rating";
import type { SetScore } from "../../../config/rating";

const EMPTY_SET: SetScore = { team1: 0, team2: 0 };

const parseArrayParam = (value?: string, fallback: string[] = []): string[] => {
  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return fallback;
    return parsed.map((item) => String(item ?? ""));
  } catch {
    return fallback;
  }
};

export default function SubmitResultScreen() {
  const router = useRouter();
  const { teamAIds, teamANames, teamBIds, teamBNames, matchId, competitive } =
    useLocalSearchParams<{
      teamAIds: string;
      teamANames: string;
      teamBIds: string;
      teamBNames: string;
      matchId: string;
      competitive: string; // route params are always strings
    }>();

  const isCompetitive = competitive === "true";
  const teamAPlayerIds = parseArrayParam(teamAIds).slice(0, 2);
  const teamBPlayerIds = parseArrayParam(teamBIds).slice(0, 2);
  const teamAPlayerNames = parseArrayParam(teamANames, [
    "Player A1",
    "Player A2",
  ]).slice(0, 2);
  const teamBPlayerNames = parseArrayParam(teamBNames, [
    "Player B1",
    "Player B2",
  ]).slice(0, 2);

  const teamALabel =
    teamAPlayerNames.filter((name) => name.trim().length > 0).join(" & ") ||
    "Team A";
  const teamBLabel =
    teamBPlayerNames.filter((name) => name.trim().length > 0).join(" & ") ||
    "Team B";

  // Up to 3 sets, start with 2 visible
  const [sets, setSets] = useState<SetScore[]>([
    { ...EMPTY_SET },
    { ...EMPTY_SET },
  ]);

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  const updateSet = (index: number, team: "team1" | "team2", value: string) => {
    const parsed = parseInt(value) || 0;
    setSets((prev) =>
      prev.map((set, i) => (i === index ? { ...set, [team]: parsed } : set)),
    );
  };

  const addSet = () => {
    if (sets.length < 3) setSets((prev) => [...prev, { ...EMPTY_SET }]);
  };

  const removeSet = () => {
    if (sets.length > 2) setSets((prev) => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    setError(null);

    // Validate all entered sets
    for (let i = 0; i < sets.length; i++) {
      if (!isValidSet(sets[i])) {
        setError(
          `Set ${i + 1} is invalid. A set needs at least 6 points and a 2-point difference (e.g. 6-4, 7-5).`,
        );
        return;
      }
    }

    const winnerTeam = determineWinner(sets);
    if (winnerTeam === null) {
      setError("No winner yet. Keep entering sets until one team wins 2.");
      return;
    }

    const winnerIds = winnerTeam === 1 ? teamAPlayerIds : teamBPlayerIds;
    const loserIds = winnerTeam === 1 ? teamBPlayerIds : teamAPlayerIds;
    const winnerName = winnerTeam === 1 ? "Team A" : "Team B";

    const hasValidTeamA =
      teamAPlayerIds.length === 2 &&
      teamAPlayerIds.every((id) => id.trim().length > 0);
    const hasValidTeamB =
      teamBPlayerIds.length === 2 &&
      teamBPlayerIds.every((id) => id.trim().length > 0);

    if (!hasValidTeamA || !hasValidTeamB) {
      setError("Both Team A and Team B must have exactly 2 players.");
      return;
    }

    setLoading(true);
    try {
      await recordDoublesMatchResult(
        winnerIds,
        loserIds,
        matchId,
        isCompetitive,
      );
      setWinner(winnerName);
      setDone(true);
    } catch (e) {
      setError("Something went wrong. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ─── Success ─────────────────────────────────────────
  if (done) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>🏆</Text>
        <Text style={styles.title}>{winner} wins!</Text>
        {isCompetitive && (
          <Text style={styles.sub}>Player ratings have been updated.</Text>
        )}
        {!isCompetitive && (
          <Text style={styles.sub}>Friendly match — ratings unchanged.</Text>
        )}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.btnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Main ─────────────────────────────────────────────
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Enter Match Results</Text>
      <Text style={styles.sub}>Team A vs Team B</Text>
      <Text style={styles.sub}>{teamALabel}</Text>
      <Text style={styles.sub}>{teamBLabel}</Text>

      {isCompetitive ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            ⚔️ Competitive — ratings will update
          </Text>
        </View>
      ) : (
        <View style={[styles.badge, styles.badgeFriendly]}>
          <Text style={styles.badgeText}>🤝 Friendly — ratings unchanged</Text>
        </View>
      )}

      {sets.map((set, index) => (
        <View key={index} style={styles.setRow}>
          <Text style={styles.setLabel}>Set {index + 1}</Text>

          <View style={styles.scoreInputs}>
            <View style={styles.scoreBlock}>
              <Text style={styles.playerLabel} numberOfLines={1}>
                Team A
              </Text>
              <TextInput
                style={styles.scoreInput}
                keyboardType="number-pad"
                value={String(set.team1)}
                onChangeText={(v) => updateSet(index, "team1", v)}
                maxLength={2}
              />
            </View>

            <Text style={styles.dash}>—</Text>

            <View style={styles.scoreBlock}>
              <Text style={styles.playerLabel} numberOfLines={1}>
                Team B
              </Text>
              <TextInput
                style={styles.scoreInput}
                keyboardType="number-pad"
                value={String(set.team2)}
                onChangeText={(v) => updateSet(index, "team2", v)}
                maxLength={2}
              />
            </View>
          </View>
        </View>
      ))}

      <View style={styles.setControls}>
        {sets.length < 3 && (
          <TouchableOpacity onPress={addSet} style={styles.setControlBtn}>
            <Text style={styles.setControlText}>+ Add set 3</Text>
          </TouchableOpacity>
        )}
        {sets.length === 3 && (
          <TouchableOpacity onPress={removeSet} style={styles.setControlBtn}>
            <Text style={[styles.setControlText, { color: "#dc2626" }]}>
              − Remove set 3
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <Text style={styles.btnText}>Submit Result</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16,
    backgroundColor: "#fff",
  },
  emoji: { fontSize: 48 },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  sub: { fontSize: 14, color: "#666", textAlign: "center" },
  badge: {
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  badgeFriendly: { backgroundColor: "#f0fdf4" },
  badgeText: { fontSize: 13, fontWeight: "600", color: "#1e40af" },
  setRow: {
    width: "100%",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  setLabel: { fontWeight: "700", fontSize: 14, color: "#0d2432" },
  scoreInputs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  scoreBlock: { alignItems: "center", gap: 4, flex: 1 },
  playerLabel: { fontSize: 12, color: "#6b7280", fontWeight: "500" },
  scoreInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    width: "100%",
    color: "#0d2432",
  },
  dash: { fontSize: 20, color: "#9ca3af", fontWeight: "300" },
  setControls: { width: "100%" },
  setControlBtn: { paddingVertical: 8 },
  setControlText: { color: "#2563eb", fontWeight: "600", textAlign: "center" },
  error: { color: "#dc2626", fontSize: 13, textAlign: "center" },
  btn: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
