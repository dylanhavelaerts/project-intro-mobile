import { Stack } from "expo-router";

const NoHeadersLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="bookCourt" />
      <Stack.Screen name="chat/[chatId]" />
      <Stack.Screen name="findMatchDetail/[matchId]" />
      <Stack.Screen name="makeMatch" />
      <Stack.Screen name="seeding/seedCourts" />
    </Stack>
  );
};

export default NoHeadersLayout;
