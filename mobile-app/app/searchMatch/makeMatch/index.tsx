import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

const MakeMatch = () => {
  return (
    <ScrollView style={styles.container}>
      <Image
        source={require("@/assets/resources/padelvenuetero.jpg")}
        style={styles.padelvenue}
      ></Image>
      <View style={styles.totalaboveview}>
        <View style={styles.viewstyle}>
          <View>
            <Text style={styles.venuetitle}>Venue name :</Text>
            <Text style={styles.venueadress}>Adress:</Text>
          </View>

          <Text>❤️</Text>
        </View>
        <View style={styles.viewstyletwo}>
          <Text style={styles.venueadress}>Home</Text>
          <Text style={styles.venueadress}>Book</Text>
          <Text style={styles.venueadress}>Open Matches</Text>
          <Text style={styles.venueadress}>Competitions</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: "left",
    paddingLeft: 2,
    color: "white",
  },
  padelvenue: {
    width: "100%",
    height: 200,
  },
  venuetitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  venueadress: {
    color: "grey",
  },
  viewstyle: {
    marginTop: -20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  viewstyletwo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  totalaboveview: {
    backgroundColor: "#fff",
  },
});

export default MakeMatch;
