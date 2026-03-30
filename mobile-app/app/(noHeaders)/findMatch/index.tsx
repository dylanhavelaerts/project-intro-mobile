import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FindMatchFilters } from "@/features/findMatch/FindMatchFilters";
import { FindMatchHeader } from "@/features/findMatch/FindMatchHeader";
import { FindMatchList } from "@/features/findMatch/FindMatchList";
import { useOpenMatches } from "@/features/findMatch/useOpenMatches";

// ------------------------------------------------------------
// SCREEN
// ------------------------------------------------------------
const FindMatch = () => {
  // ------------------------------------------------------------
  // DATA STATE
  // ------------------------------------------------------------
  const { matches, loading, error } = useOpenMatches();

  return (
    <View style={styles.container}>
      <FindMatchHeader />
      <FindMatchFilters />
      <FindMatchList loading={loading} error={error} matches={matches} />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push("/(noHeaders)/bookCourt" as any)}
      >
        <Text style={styles.floatingButtonPlus}>+</Text>
        <Text style={styles.floatingButtonText}>Start a match</Text>
      </TouchableOpacity>
    </View>
  );
};

// ------------------------------------------------------------
// STYLES
// ------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f0",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#335FFF",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 30,
    gap: 8,
    shadowColor: "#335FFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingButtonPlus: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },
  floatingButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});

export default FindMatch;
