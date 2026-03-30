import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export const DetailHeroHeader = () => {
  return (
    <View style={styles.hero}>
      <View style={[styles.courtLine, styles.lineOne]} />
      <View style={[styles.courtLine, styles.lineTwo]} />
      <View style={[styles.courtLine, styles.lineThree]} />
      <View style={styles.ballDot} />

      <View style={styles.headerRow}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#0d2432" />
        </Pressable>
        <View style={styles.headerActions}>
          <View style={styles.iconButton}>
            <Ionicons name="share-outline" size={22} color="#0d2432" />
          </View>
          <View style={styles.iconButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#0d2432" />
          </View>
        </View>
      </View>
    </View>
  );
};

// ------------------------------------------------------------
// STYLES
// ------------------------------------------------------------
const styles = StyleSheet.create({
  hero: {
    height: 230,
    backgroundColor: "#335FFF",
    paddingHorizontal: 20,
    paddingTop: 54,
    overflow: "hidden",
  },
  courtLine: {
    position: "absolute",
    borderColor: "rgba(255,255,255,0.9)",
    borderWidth: 3,
  },
  lineOne: {
    width: 380,
    height: 220,
    top: -76,
    left: -22,
    transform: [{ rotate: "-31deg" }],
  },
  lineTwo: {
    width: 380,
    height: 220,
    top: -48,
    right: -160,
    transform: [{ rotate: "-31deg" }],
  },
  lineThree: {
    width: 420,
    height: 180,
    top: 78,
    left: -100,
    transform: [{ rotate: "-31deg" }],
  },
  ballDot: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#c8fc2c",
    left: "37%",
    top: "50%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
});
