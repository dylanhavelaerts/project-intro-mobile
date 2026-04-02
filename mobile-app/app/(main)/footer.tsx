import { router, usePathname } from "expo-router";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

const Footer = () => {
  const pathname = usePathname();
  const isHomeActive = pathname?.includes("/homepage/home");

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <View style={styles.itemWrapper}>
          <Image
            source={require("../../assets/images/homepage/home.png")}
            style={[styles.icon, isHomeActive && styles.iconActive]}
          />
          <Text style={[styles.menuText, isHomeActive && styles.menuTextActive]}>
            Home
          </Text>
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
  menuTextActive: {
    color: "#335FFF",
    fontWeight: "600",
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
  iconActive: {
    tintColor: "#335FFF",
  },
});

export default Footer;
