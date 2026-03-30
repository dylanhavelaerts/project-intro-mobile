import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ------------------------------------------------------------
// PROPS
// ------------------------------------------------------------
type MatchMetaCardsProps = {
  courtBooked: boolean;
  competitive?: boolean;
};

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export const MatchMetaCards = ({
  courtBooked,
  competitive,
}: MatchMetaCardsProps) => {
  return (
    <>
      <View style={styles.statusCard}>
        <View style={styles.statusGroup}>
          <Ionicons name="lock-closed-outline" size={24} color="#141d27" />
          <Text style={styles.statusText}>Open Match</Text>
        </View>
        <View style={styles.statusGroup}>
          {courtBooked ? (
            <Ionicons name="checkmark-circle" size={24} color="#45bf79" />
          ) : (
            <Ionicons name="ellipse-outline" size={22} color="#8795a6" />
          )}
          <Text style={styles.statusText}>
            {courtBooked ? "Court booked" : "Court pending"}
          </Text>
        </View>
      </View>

      <View style={styles.modeCard}>
        <Text style={styles.modeTitle}>
          {competitive ? "Competitive" : "Friendly"}
        </Text>
        <Text style={styles.modeSubtext}>
          {competitive
            ? "This match contributes to your level"
            : "The result of this match does not count towards the level"}
        </Text>
      </View>
    </>
  );
};

// ------------------------------------------------------------
// STYLES
// ------------------------------------------------------------
const styles = StyleSheet.create({
  statusCard: {
    marginTop: 14,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d9dde3",
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusText: {
    fontSize: 13,
    color: "#243341",
    fontWeight: "500",
  },
  statusGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modeCard: {
    marginTop: 14,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d9dde3",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  modeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#243341",
  },
  modeSubtext: {
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
  },
});
