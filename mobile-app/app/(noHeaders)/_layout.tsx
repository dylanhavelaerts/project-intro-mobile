import { Stack } from "expo-router";

const NoHeadersLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="bookCourt" />
      <Stack.Screen name="makeMatch" />
      <Stack.Screen name="seedCourts" />
    </Stack>
  );
};

export default NoHeadersLayout;
