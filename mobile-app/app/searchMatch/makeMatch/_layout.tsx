import { Stack } from "expo-router";
import { View } from "react-native";
import HeaderMatch from "./headermatch";

const makeMatchLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <HeaderMatch></HeaderMatch>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
};

export default makeMatchLayout;
