import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ------------------------------------------------------------
// STATIC FILTER DATA
// ------------------------------------------------------------
const FILTERS = ["Padel", "45 Clubs", "Wed-Fri-Sat-Sun,..."];

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export const FindMatchFilters = () => {
  return (
    <View style={styles.filterSection}>
      <Image
        source={require("@/assets/images/bookCourt/settings-sliders.png")}
        style={styles.settingsIcon}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        {FILTERS.map((label) => (
          <TouchableOpacity key={label} style={styles.filterPill}>
            <Text style={styles.filterText}>{label}</Text>
            <Image
              source={require("@/assets/images/bookCourt/arrow-down.png")}
              style={styles.downArrowIcon}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// ------------------------------------------------------------
// STYLES
// ------------------------------------------------------------
const styles = StyleSheet.create({
  filterSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterScrollContent: {
    gap: 10,
    paddingRight: 20,
  },
  settingsIcon: {
    height: 20,
    width: 20,
    marginRight: 12,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d2432",
    paddingRight: 8,
    paddingLeft: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  filterText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  downArrowIcon: {
    height: 14,
    width: 14,
    tintColor: "white",
  },
});
