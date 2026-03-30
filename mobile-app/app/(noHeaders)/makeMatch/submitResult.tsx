import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { recordMatchResult } from "../../../config/rating";

export default function SubmitResultScreen() {
  const router = useRouter();
  const { player1Id, player1Name, player2Id, player2Name, matchId } =
    useLocalSearchParams<{
      player1Id: string;
      player1Name: string;
      player2Id: string;
      player2Name: string;
      matchId?: string;
    }>();

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSelectWinner(winnerId: string, loserId: string) {
    setLoading(true);
    setError(null);
    try {
      await recordMatchResult(winnerId, loserId, matchId);
      setDone(true);
    } catch (e) {
      setError("Something went wrong. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // ─── Success state ────────────────────────────────────
  if (done) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>Result saved!</Text>
        <Text style={styles.sub}>Player ratings have been updated.</Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.btnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Main state ───────────────────────────────────────
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who won the match?</Text>
      <Text style={styles.sub}>Tap the winning player to save the result</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => handleSelectWinner(player1Id, player2Id)}
          >
            <Text style={styles.btnText}>{player1Name}</Text>
          </TouchableOpacity>

          <Text style={styles.vs}>vs</Text>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => handleSelectWinner(player2Id, player1Id)}
          >
            <Text style={styles.btnText}>{player2Name}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
    backgroundColor: "#fff",
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  sub: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  error: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
  },
  btnGroup: {
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
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
  vs: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
  },
});
