import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";

const HeaderMatch = () => {
  const router = useRouter();

  return (
    <View style={styles.content}>
      <Pressable onPress={() => router.back()}>
        <Image
          source={require("@/assets/images/bookCourt/back.png")}
          style={styles.icon}
        />
      </Pressable>
      <Image
        source={require("@/assets/resources/share.png")}
        style={styles.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#FFF",
    height: "10%",
    textAlign: "left",
    paddingLeft: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backArrow: {
    fontSize: 20,
    margin: 20,
    marginBottom: 40,
  },
  icon: {
    width: 24,
    height: 24,
    margin: 20,
    marginBottom: 40,
  },
});

export default HeaderMatch;
