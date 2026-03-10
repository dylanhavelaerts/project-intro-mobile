import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
  FlatList,
  Switch,
} from "react-native";

const { width } = Dimensions.get("window");

const MakeMatch = () => {
  const [activeTab, setActiveTab] = useState("openMatches");
  const [selectedDay, setSelectedDay] = useState("");
  const [showAvailable, setShowAvailable] = useState(true);
  const timeSlots = [
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
  ];
  const generateDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        day: date
          .toLocaleDateString("en-US", { weekday: "short" })
          .toUpperCase(),
        date: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "short" }),
      });
    }
    return days;
  };
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
          <Image
            source={require("@/assets/images/bookCourt/heart.png")}
            style={{ height: 20, width: 20 }}
          ></Image>
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
          <View style={{ backgroundColor: "#f5f5f5" }}>
            <ScrollView
              horizontal
              style={{
                padding: 10,
              }}
            >
              {generateDays().map((item) => (
                <Pressable
                  key={item.date}
                  onPress={() => setSelectedDay(item.day)}
                >
                  <View style={styles.dayCard}>
                    <Text>{item.day}</Text>
                    <View
                      style={[
                        styles.circle,
                        selectedDay === item.day && styles.selectedCircle,
                      ]}
                    >
                      <Text
                        style={
                          selectedDay === item.day ? { color: "white" } : null
                        }
                      >
                        {item.date}
                      </Text>
                    </View>
                    <Text>{item.month}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
            <View style={styles.toggleRow}>
              <Text>Show available slots only</Text>
              <Switch value={showAvailable} onValueChange={setShowAvailable} />
            </View>
            <ScrollView horizontal style={styles.timeSlotsContainer}>
              {timeSlots.map((item) => (
                <Pressable key={item} style={styles.timeSlot}>
                  <Text>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
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
    color: "#a1a1a1",
    fontSize: 14,
    fontWeight: "500",
  },
  activeTab: {
    color: "black",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  selectedCircle: {
    backgroundColor: "#333",

    alignItems: "center",
    justifyContent: "center",
  },
  dayCard: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  circle: {
    backgroundColor: "#fff",
    borderRadius: 50,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 0.5,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 25,
  },
  timeSlot: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
});

export default MakeMatch;
