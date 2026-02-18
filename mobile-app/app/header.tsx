import { View, Text, StyleSheet } from "react-native";

const Header = () => {
  return (
    <View style={styles.content}>
      <h2>Playtomic</h2>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor:"#335FFF",
    height:"5%",
    textAlign: "left",
    paddingLeft: "2vw",
    color: "white"
  },
});

export default Header;
