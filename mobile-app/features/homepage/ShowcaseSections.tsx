import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export const SuggestedForYouSection = () => {
  return (
    <View style={styles.sectionWrap}>
      <View style={styles.rowHeader}>
        <Text style={styles.sectionTitle}>Suggested for you</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>

      <View style={styles.suggestedCard}>
        <View style={styles.addIconWrap}>
          <Text style={styles.plus}>+</Text>
        </View>
        <Text style={styles.suggestedText}>Add friends from your address book</Text>
      </View>
    </View>
  );
};

export const ImproveLevelSection = () => {
  return (
    <View style={styles.sectionWrap}>
      <View style={styles.rowHeader}>
        <Text style={styles.sectionTitle}>Improve your level</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.levelScroll}
      >
        {[1, 2].map((item) => (
          <View key={item} style={styles.levelCard}>
            <Text style={styles.dateLabel}>30 Mar - 30 Apr | 5 weeks</Text>
            <Text style={styles.levelTitle} numberOfLines={1}>
              5 weeks cycle Ladies P50 (Monday)
            </Text>

            <View style={styles.pillRow}>
              <View style={styles.pill}><Text style={styles.pillText}>0</Text></View>
              <View style={styles.pill}><Text style={styles.pillText}>Calendar</Text></View>
            </View>

            <View style={styles.pillRow}>
              <View style={styles.pill}><Text style={styles.pillText}>Female</Text></View>
              <View style={styles.pill}><Text style={styles.pillText}>0 - 7</Text></View>
            </View>

            <View style={styles.separator} />

            <View style={styles.locationRow}>
              <Image
                source={require("@/assets/images/homepage/court.png")}
                style={styles.locationIcon}
              />
              <View style={styles.locationTextWrap}>
                <Text style={styles.locationName} numberOfLines={1}>YC5 (new synthetic...)</Text>
                <Text style={styles.locationMeta}>33km - Vilvoorde</Text>
              </View>
              <View style={styles.priceWrap}>
                <Text style={styles.price}>EUR 145</Text>
                <Text style={styles.oneTime}>One-time</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrap: {
    marginTop: 0,
  },
  rowHeader: {
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#0f2437",
    fontWeight: "700",
    fontFamily: "System",
  },
  seeAll: {
    color: "#335FFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "System",
  },
  suggestedCard: {
    marginHorizontal: 15,
    width: 145,
    minHeight: 175,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d2d7de",
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  addIconWrap: {
    width: 76,
    height: 76,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#d7dce2",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  plus: {
    fontSize: 36,
    color: "#1f2b37",
    marginTop: -2,
  },
  suggestedText: {
    marginTop: 18,
    textAlign: "center",
    color: "#1f2b37",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    fontFamily: "System",
  },
  levelScroll: {
    paddingLeft: 15,
    paddingRight: 18,
    gap: 12,
  },
  levelCard: {
    width: 338,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d2d7de",
    backgroundColor: "#f3f4f6",
    padding: 14,
  },
  dateLabel: {
    color: "#5f6c79",
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "System",
  },
  levelTitle: {
    marginTop: 8,
    color: "#0f2437",
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "System",
  },
  pillRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
  },
  pill: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d7dce2",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  pillText: {
    color: "#536170",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "System",
  },
  separator: {
    marginTop: 12,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e7ec",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    width: 24,
    height: 24,
    tintColor: "#1f2b37",
  },
  locationTextWrap: {
    marginLeft: 10,
    flex: 1,
  },
  locationName: {
    fontSize: 13,
    color: "#1f2b37",
    fontWeight: "600",
    fontFamily: "System",
  },
  locationMeta: {
    marginTop: 2,
    fontSize: 11,
    color: "#677583",
    fontFamily: "System",
    fontWeight: "500",
  },
  priceWrap: {
    alignItems: "flex-end",
  },
  price: {
    color: "#335FFF",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "System",
  },
  oneTime: {
    marginTop: 2,
    color: "#335FFF",
    fontSize: 11,
    fontFamily: "System",
    fontWeight: "500",
  },
});
