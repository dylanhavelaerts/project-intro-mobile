import { View, Text, StyleSheet, Image } from "react-native";

const Header = () => {
  return (
      <View style={styles.container}>
        <Text style={styles.logo}>Playtomic</Text>

        <View style={styles.menuContainer}>
          <Image 
            source={require("../assets/images/homepage/bell.png")} 
            style={styles.icon} 
          />
          <Image 
            source={require("../assets/images/homepage/menu-burger.png")} 
            style={styles.icon} 
          />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 110, 
    backgroundColor: "#335FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 25,
    color: "white"
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white"
  },
  menuText:{
    color: "white"
  },
  menuContainer: {
    flexDirection: "row",
    gap: 25,
  },
    icon: {
    width: 20, 
    height: 20,
    marginBottom: 5,
    resizeMode: "contain",
    tintColor: "white",
  },
});

export default Header;