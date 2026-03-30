import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CourtDoc } from "./types";

// ------------------------------------------------------------
// PROPS
// ------------------------------------------------------------
type MatchInformationSectionProps = {
  court: CourtDoc | null;
  endRegistration: string;
};

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export const MatchInformationSection = ({
  court,
  endRegistration,
}: MatchInformationSectionProps) => {
  return (
    <View style={styles.infoSection}>
      <Text style={styles.infoHeading}>Information</Text>

      <View style={styles.infoRow}>
        <Ionicons
          name="information-circle-outline"
          size={22}
          color="#11181f"
          style={styles.infoIcon}
        />
        <View style={styles.infoCopyWrap}>
          <Text style={styles.infoLabel}>Court name</Text>
          <Text style={styles.infoValue}>
            {court?.name ?? "To be assigned"}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons
          name="grid-outline"
          size={22}
          color="#11181f"
          style={styles.infoIcon}
        />
        <View style={styles.infoCopyWrap}>
          <Text style={styles.infoLabel}>Type of court</Text>
          <Text style={styles.infoValue}>
            {court
              ? `${court.type ?? "Unknown"}, ${court.surface ?? "Unknown"}`
              : "Not available"}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons
          name="calendar-outline"
          size={22}
          color="#11181f"
          style={styles.infoIcon}
        />
        <View style={styles.infoCopyWrap}>
          <Text style={styles.infoLabel}>End registration</Text>
          <Text style={styles.infoValue}>{endRegistration}</Text>
        </View>
      </View>
    </View>
  );
};

// ------------------------------------------------------------
// STYLES
// ------------------------------------------------------------
const styles = StyleSheet.create({
  infoSection: {
    marginTop: 18,
    marginHorizontal: 16,
    paddingHorizontal: 2,
  },
  infoHeading: {
    fontSize: 14,
    color: "#13283a",
    fontWeight: "700",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 18,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoCopyWrap: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  infoValue: {
    marginTop: 2,
    fontSize: 13,
    color: "#13283a",
    fontWeight: "500",
  },
});
