import { Text, View, Image, Pressable } from "react-native";
import { router } from "expo-router";

const Index = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Pressable onPress={() => router.push("/searchMatch/makeMatch")}>
        <Text>Go to Make Match</Text>
      </Pressable>
    </View>
  );
};

export default Index;
