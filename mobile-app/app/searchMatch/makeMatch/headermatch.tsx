import { View, Text, StyleSheet, Image } from "react-native";

const HeaderMatch = () => {
  return (
    <View style={styles.content}>
      <Text style={styles.icon}>←</Text>
      <Image
        source={require("@/assets/resources/share.png")}
        style={styles.icon}
      ></Image>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#FFF",
    height: "10%",
    textAlign: "left",
    paddingLeft: 2,
    color: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    width: 24,
    height: 24,
    margin: 20,
    marginBottom: 40,
  },
});

export default HeaderMatch;
