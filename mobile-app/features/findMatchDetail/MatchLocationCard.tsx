import { Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LocationDoc } from "./types";

// ------------------------------------------------------------
// PROPS
// ------------------------------------------------------------
type MatchLocationCardProps = {
  location: LocationDoc | null;
};

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export const MatchLocationCard = ({ location }: MatchLocationCardProps) => {
  return (
    <View style={styles.locationCard}>
      {location?.imageUrl ? (
        <Image
          source={{ uri: location.imageUrl }}
          style={styles.locationImage}
        />
      ) : (
        <View style={styles.locationPlaceholder}>
          <Text style={styles.locationPlaceholderText}>Court</Text>
        </View>
      )}

      <View style={styles.locationTextWrap}>
        <Text numberOfLines={1} style={styles.locationName}>
          {location?.name ?? "Location"}
        </Text>
        <Text numberOfLines={1} style={styles.locationAddress}>
          {location?.address ?? "Address unknown"}
          {location?.city ? `, ${location.city}` : ""}
        </Text>
        <View style={styles.moreInfoRow}>
          <Text style={styles.moreInfo}>More info</Text>
        </View>
      </View>

      <View style={styles.arrowButton}>
        <Ionicons name="arrow-redo-outline" size={22} color="#fff" />
      </View>
    </View>
  );
};

// ------------------------------------------------------------
// STYLES
// ------------------------------------------------------------
const styles = StyleSheet.create({
  locationCard: {
    marginTop: 14,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d9dde3",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  locationImage: {
    width: 82,
    height: 68,
    borderRadius: 8,
  },
  locationPlaceholder: {
    width: 82,
    height: 68,
    borderRadius: 8,
    backgroundColor: "#dbe4f0",
    justifyContent: "center",
    alignItems: "center",
  },
  locationPlaceholderText: {
    color: "#0d2432",
    fontWeight: "700",
  },
  locationTextWrap: {
    flex: 1,
  },
  locationName: {
    fontSize: 12,
    color: "#13283a",
    fontWeight: "600",
  },
  locationAddress: {
    marginTop: 2,
    fontSize: 11,
    color: "#6b7280",
  },
  moreInfo: {
    marginTop: 6,
    fontSize: 11,
    color: "#335FFF",
    fontWeight: "600",
  },
  moreInfoRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#335FFF",
    justifyContent: "center",
    alignItems: "center",
  },
});
