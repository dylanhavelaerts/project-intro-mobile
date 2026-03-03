import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";

import Header from "./header";
import Footer from "./footer";

const HomeLayout = () => {
  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <Header />

      <View style={styles.content}>
        <Slot />
      </View>

=======
      <View style={styles.content}>
        <Slot />
      </View>

>>>>>>> origin/page-makeMatch
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
<<<<<<< HEAD
    backgroundColor: "white"
=======
    backgroundColor: "white",
>>>>>>> origin/page-makeMatch
  },
});

export default HomeLayout;
