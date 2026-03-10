import { router } from "expo-router";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";

const index = () => {
    return (
        <View style={styles.loginBox}>
            <Image
                source={require("@/assets/images/login/PlaytomicLogoNoText.png")}
                style={{ width: 80, height: 80, marginBottom: 10, tintColor: "white" }}
            />
            <Text style={styles.logoText}>PLAYTOMIC</Text>
            <Pressable onPress={() => router.push("/welcome/register" as any)}>
                <Text style={styles.registerButton}>Register</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/welcome/login" as any)}>
                <Text style={styles.loginButton}>Login</Text>
            </Pressable>    
        </View>
    );
};

const styles = StyleSheet.create({
    loginBox: {
        backgroundColor: "#162b37",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    logoText: {
        color: "white",
        fontFamily: "System",
        fontWeight: "500",
        fontSize: 32,
        textAlign: "center",
        letterSpacing: 7,
        marginBottom: 60,
    },
    registerButton: {
        color: "white",
        fontSize: 18,
        backgroundColor: "#335FFF",
        width: 150,
        alignSelf: "center",
        textAlign: "center",
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    loginButton: {
        color: "white",
        fontSize: 18,
        borderColor: "white",
        borderWidth: 1,
        width: 150,
        alignSelf: "center",
        textAlign: "center",
        paddingVertical: 12,
        borderRadius: 8,
    }
});

export default index;