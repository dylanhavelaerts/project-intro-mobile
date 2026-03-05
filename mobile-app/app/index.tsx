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

      <Link href="/(noHeaders)/welcome" asChild>
        <Button title="Welcome" />
      </Link>
    </View>
  );
};

export default Index;
