import { Link } from "expo-router";
import { View, Button } from "react-native";

const Index = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/homepage/home" asChild>
        <Button title="Home" />
      </Link>

      <Link href="/searchMatch/makeMatch" asChild>
        <Button title="Go to Make Match" />
      </Link>
    </View>
  );
};

export default Index;
