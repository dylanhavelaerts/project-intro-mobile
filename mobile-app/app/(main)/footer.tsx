import { router } from "expo-router";
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from "react-native";

const Footer = () => {
  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <View style={styles.itemWrapper}>
          <Image
            source={require("../../assets/images/homepage/home.png")}
            style={styles.icon}
          />
          <Text style={styles.menuText}>Home</Text>
        </View>

        <View style={styles.itemWrapper}>
          <Image
            source={require("../../assets/images/homepage/group.png")}
            style={styles.icon}
          />
          <Text style={styles.menuText}>Community</Text>
        </View>

        <Pressable style={styles.itemWrapper} onPress={() => router.push("/")}>
          <Image
            source={require("../../assets/images/homepage/profile.png")}
            style={styles.icon}
          />
          <Text style={styles.menuText}>Profile</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 84,
    backgroundColor: "white",
    borderTopWidth: 0.65,
    borderTopColor: "lightgrey",
    justifyContent: "center",
  },
  menuText: {
    color: "grey",
    fontSize: 14,
    paddingBottom: 20,
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 50,
  },
  itemWrapper: {
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    marginBottom: 5,
    resizeMode: "contain",
    tintColor: "grey",
  },
});

export default Footer;
