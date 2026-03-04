import { Stack } from "expo-router";

const NoHeadersLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="bookCourt" />
      <Stack.Screen name="makeMatch" />
    </Stack>
  );
};

export default NoHeadersLayout;
