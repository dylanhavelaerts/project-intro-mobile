import { router } from "expo-router";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MatchCard, { MatchData } from "../../../components/MatchCard";

// Placeholder match data — will be replaced by Firestore later
const PLACEHOLDER_MATCHES: MatchData[] = [
  {
    id: "1",
    date: "Friday, 13 March",
    time: "16:30",
    type: "Friendly",
    levelRange: "1 - 4",
    players: [
      { name: "Zouhair", rating: "1,7", avatar: null },
      { name: "Ilias El", rating: "1,4", avatar: null },
      null,
      null,
    ],
    court: "Heiveld Padel",
    distance: "20km",
    location: "Sint-Katelijne-Waver",
    price: "€ 6",
    duration: "90min",
  },
  {
    id: "2",
    date: "Sunday, 15 March",
    time: "19:00",
    type: "Friendly",
    levelRange: "0,5 - 2,3",
    players: [
      null,
      null,
      { name: "Mehebo...", rating: "1,2", avatar: null },
      { name: "Junko", rating: "0,6", avatar: null },
    ],
    court: "Antwerp Padelclub - Berchem",
    distance: "5km",
    location: "Berchem",
    price: "€ 10,50",
    duration: "90min",
  },
  {
    id: "3",
    date: "Sunday, 15 March",
    time: "22:00",
    type: "Friendly",
    levelRange: "1 - 3",
    players: [
      { name: "Player", rating: "1,5", avatar: null },
      null,
      { name: "Player2", rating: "2,0", avatar: null },
      null,
    ],
    court: "Padel City Antwerp",
    distance: "8km",
    location: "Antwerp",
    price: "€ 8",
    duration: "90min",
  },
];

const FindMatch = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerSide}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require("../../../assets/images/bookCourt/back.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>Available</Text>
        <View style={styles.headerSide} />
      </View>

      {/* Filter pills */}
      <View style={styles.filterSection}>
        <Image
          source={require("../../../assets/images/bookCourt/settings-sliders.png")}
          style={styles.settingsIcon}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterText}>Padel</Text>
            <Image
              source={require("../../../assets/images/bookCourt/arrow-down.png")}
              style={styles.downArrowIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterText}>45 Clubs</Text>
            <Image
              source={require("../../../assets/images/bookCourt/arrow-down.png")}
              style={styles.downArrowIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterText}>Wed-Fri-Sat-Sun,...</Text>
            <Image
              source={require("../../../assets/images/bookCourt/arrow-down.png")}
              style={styles.downArrowIcon}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Match list */}
      <ScrollView
        style={styles.matchList}
        contentContainerStyle={styles.matchListContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>For your level</Text>
        <Text style={styles.sectionSubtitle}>
          These matches fit your search and your level perfectly
        </Text>

        {PLACEHOLDER_MATCHES.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </ScrollView>

      {/* Floating button */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f0",
  },

  // HEADER
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

  // FILTER SECTION
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

  // MATCH LIST
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

  // FLOATING BUTTON
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
