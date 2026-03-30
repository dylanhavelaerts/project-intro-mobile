import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import MatchCard, { MatchData } from "@/components/MatchCard";

// ------------------------------------------------------------
// PROPS
// ------------------------------------------------------------
type FindMatchListProps = {
  loading: boolean;
  error: string | null;
  matches: MatchData[];
};

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export const FindMatchList = ({
  loading,
  error,
  matches,
}: FindMatchListProps) => {
  return (
    <ScrollView
      style={styles.matchList}
      contentContainerStyle={styles.matchListContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>For your level</Text>
      <Text style={styles.sectionSubtitle}>
        These matches fit your search and your level perfectly
      </Text>

      {loading ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#335FFF" />
        </View>
      ) : error ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>{error}</Text>
        </View>
      ) : matches.length === 0 ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>No open matches found yet.</Text>
        </View>
      ) : (
        matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            onPress={() =>
              router.push(`/(noHeaders)/findMatchDetail/${match.id}` as any)
            }
          />
        ))
      )}
    </ScrollView>
  );
};

// ------------------------------------------------------------
// STYLES
// ------------------------------------------------------------
const styles = StyleSheet.create({
  matchList: {
    flex: 1,
  },
  matchListContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0d2432",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  stateContainer: {
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  stateText: {
    color: "#6b7280",
    fontSize: 14,
    textAlign: "center",
  },
});
