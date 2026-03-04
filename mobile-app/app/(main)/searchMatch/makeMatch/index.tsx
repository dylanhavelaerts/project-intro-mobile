import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
} from "react-native";

const { width } = Dimensions.get("window");

const MakeMatch = () => {
  const [activeTab, setActiveTab] = useState("openMatches");
  const [selectedDay, setSelectedDay] = useState("");
  return (
    <ScrollView style={styles.container}>
      <Image
        source={require("@/assets/resources/padelvenuetero.jpg")}
        style={styles.padelvenue}
        resizeMode="cover"
      />
      <View style={styles.totalaboveview}>
        <View style={styles.viewstyle}>
          <View style={styles.venueInfo}>
            <Text style={styles.venuetitle}>Venue name</Text>
            <Text style={styles.venueadress}>Address</Text>
          </View>
          <Text style={styles.heartIcon}>❤️</Text>
        </View>
        <View style={styles.viewstyletwo}>
          <Pressable
            onPress={() => {
              setActiveTab("Home");
            }}
          >
            <Text
              style={activeTab == "Home" ? styles.activeTab : styles.tabText}
            >
              Home
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setActiveTab("Book");
            }}
          >
            <Text
              style={activeTab == "Book" ? styles.activeTab : styles.tabText}
            >
              Book
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setActiveTab("Open Matches");
            }}
          >
            <Text
              style={
                activeTab == "Open Matches" ? styles.activeTab : styles.tabText
              }
            >
              Open Matches
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setActiveTab("Competitions");
            }}
          >
            <Text
              style={
                activeTab == "Competitions" ? styles.activeTab : styles.tabText
              }
            >
              Competitions
            </Text>
          </Pressable>
        </View>
        {activeTab == "Open Matches" && (
          // Height onderaan een klein beetje aangepast zodat dat er mooier uitzag op mn scherm maar styling moet sws nog verbeterd worden.
          <ScrollView horizontal style={{ height: "20%" }}>
            <Pressable
              onPress={() => {
                setSelectedDay("MON");
              }}
            >
              <View>
                <Text>MON</Text>
                <View
                  style={selectedDay === "MON" ? styles.selectedCircle : null}
                >
                  <Text>09</Text>
                </View>

                <Text>Feb</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                setSelectedDay("TUE");
              }}
            >
              <View>
                <Text>TUE</Text>
                <View
                  style={selectedDay === "TUE" ? styles.selectedCircle : null}
                >
                  <Text>10</Text>
                </View>

                <Text>Feb</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                setSelectedDay("WED");
              }}
            >
              <View>
                <Text>WED</Text>
                <View
                  style={selectedDay === "WED" ? styles.selectedCircle : null}
                >
                  <Text>11</Text>
                </View>

                <Text>Feb</Text>
              </View>
            </Pressable>
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  padelvenue: {
    width: width,
    height: width * 0.6,
    resizeMode: "cover",
  },
  totalaboveview: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    elevation: 5,
  },
  viewstyle: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  venueInfo: {
    flex: 1,
  },
  venuetitle: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#333",
    marginBottom: 6,
  },
  venueadress: {
    color: "#888",
    fontSize: 14,
  },
  heartIcon: {
    fontSize: 24,
    marginLeft: 15,
  },
  viewstyletwo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 15,
    paddingVertical: 16,
  },
  tabText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  activeTab: {
    backgroundColor: "red",
  },
  selectedCircle: {
    backgroundColor: "#333",
    borderRadius: 50,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MakeMatch;
