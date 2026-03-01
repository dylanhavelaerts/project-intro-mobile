import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const MakeMatch = () => {
  const [activeTab, setActiveTab] = useState("openMatches");
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
          <Pressable>
            <Text style={styles.tabText}>Home</Text>
          </Pressable>
          <Text style={styles.tabText}>Book</Text>
          <Text style={styles.tabText}>Open Matches</Text>
          <Text style={styles.tabText}>Competitions</Text>
        </View>
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
});

export default MakeMatch;
