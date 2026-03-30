import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export const FindMatchHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerSide}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("@/assets/images/bookCourt/back.png")}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.headerText}>Available</Text>
      <View style={styles.headerSide} />
    </View>
  );
};

// ------------------------------------------------------------
// STYLES
// ------------------------------------------------------------
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    padding: 25,
    paddingTop: 40,
    alignItems: "center",
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  headerSide: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerIcon: {
    height: 32,
    width: 32,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
