import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";

import Header from "./header";
import Footer from "./footer";

const HomeLayout = () => {
  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        <Slot />
      </View>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "white"
  },
});

export default HomeLayout;
