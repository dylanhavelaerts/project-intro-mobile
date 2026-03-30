import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ------------------------------------------------------------
// PROPS
// ------------------------------------------------------------
type MatchSummaryCardProps = {
  placesLeft: number;
  timeLabel: string;
  mixed?: boolean;
  levelRange: string;
  priceLabel: string;
};

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export const MatchSummaryCard = ({
  placesLeft,
  timeLabel,
  mixed,
  levelRange,
  priceLabel,
}: MatchSummaryCardProps) => {
  return (
    <View style={styles.mainCard}>
      <View style={styles.noticeRow}>
        <Text style={styles.noticeBullet}>!</Text>
        <Text style={styles.noticeText}>
          {placesLeft} places left to confirm the match
        </Text>
      </View>

      <View style={styles.matchHeaderRow}>
        <View style={styles.iconStub}>
          <Ionicons name="tennisball-outline" size={24} color="#6b7280" />
        </View>

        <View style={styles.matchTextWrap}>
          <Text style={styles.matchType}>PADEL</Text>
          <Text style={styles.matchTime}>{timeLabel}</Text>
        </View>

        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>P</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statRow}>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>Gender</Text>
          <Text style={styles.statValue}>
            {mixed ? "Mixed" : "All players"}
          </Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>Level</Text>
          <Text style={styles.statValue}>{levelRange}</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statLabel}>Price</Text>
          <Text style={styles.statValue}>{priceLabel}</Text>
        </View>
      </View>
    </View>
  );
};

// ------------------------------------------------------------
// STYLES
// ------------------------------------------------------------
const styles = StyleSheet.create({
  mainCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -58,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#ead28f",
    padding: 14,
  },
  noticeRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f5efe0",
    borderWidth: 1,
    borderColor: "#eadfba",
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 10,
  },
  noticeBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: "center",
    textAlignVertical: "center",
    overflow: "hidden",
    backgroundColor: "#f6bf3a",
    color: "#fff",
    fontWeight: "700",
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: "#2e3b47",
    fontWeight: "500",
  },
  matchType: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "600",
    color: "#0d2432",
    letterSpacing: 0.8,
  },
  matchTime: {
    marginTop: 1,
    fontSize: 12,
    color: "#1f2e3c",
    fontWeight: "500",
  },
  matchHeaderRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  matchTextWrap: {
    flex: 1,
  },
  iconStub: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  logoBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#0d2432",
    justifyContent: "center",
    alignItems: "center",
  },
  logoBadgeText: {
    color: "#d5b764",
    fontWeight: "400",
    fontSize: 24,
    marginTop: -1,
  },
  divider: {
    marginVertical: 16,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statBlock: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0d2432",
  },
});
