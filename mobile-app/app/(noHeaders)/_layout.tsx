import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";

const NoHeadersLayout = () => {
  return (
    <View style={styles.container}>
      <Slot />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default NoHeadersLayout;
