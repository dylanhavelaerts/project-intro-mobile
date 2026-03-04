import { Link } from "expo-router";
import { Text, View, Button } from "react-native";

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

      <Link href="/(noHeaders)/login" asChild>
        <Button title="Login" />
      </Link>
    </View>
  );
};

export default Index;
