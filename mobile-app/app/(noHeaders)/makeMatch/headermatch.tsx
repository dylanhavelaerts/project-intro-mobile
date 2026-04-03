import { View, StyleSheet, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";

const HeaderMatch = () => {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerSide}>
        <Pressable onPress={() => router.back()}>
          <Image
            source={require("@/assets/images/bookCourt/back.png")}
            style={styles.headerIcon}
          />
        </Pressable>
      </View>

      <View style={styles.headerSideRight}>
        <Image
          source={require("@/assets/resources/share.png")}
          style={styles.headerIcon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    padding: 25,
    paddingTop: 40,
    paddingBottom: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerSide: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerSideRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  headerIcon: {
    width: 32,
    height: 32,
  },
});

export default HeaderMatch;
