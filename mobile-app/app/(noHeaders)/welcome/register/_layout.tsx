import { Stack } from "expo-router";

export default function RegisterLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "#162b37" },
                animation: "slide_from_right",
            }}
        />
    );
}
