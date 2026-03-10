import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInput,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";

const RegisterCredentials = () => {
    const { sport, level } = useLocalSearchParams<{ sport: string; level: string }>();
    
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!username.trim()) {
            newErrors.username = "Username is required";
        } else if (username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            // Create user with Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user profile to Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                username: username.trim(),
                email: email.toLowerCase().trim(),
                sport: sport,
                level: level,
                createdAt: new Date().toISOString(),
                profilePhoto: null,
            });

            Alert.alert("Success", "Account created successfully!", [
                {
                    text: "OK",
                    onPress: () => router.replace("/(main)/homepage/home"),
                },
            ]);
        } catch (error: any) {
            let errorMessage = "Registration failed. Please try again.";
            
            if (error.code === "auth/email-already-in-use") {
                errorMessage = "This email is already registered.";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Invalid email address.";
            } else if (error.code === "auth/weak-password") {
                errorMessage = "Password is too weak.";
            }
            
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
        >
            {/* Header */}
            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backText}>← Back</Text>
            </Pressable>

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Enter your details to get started</Text>

            {/* Username */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={[styles.input, errors.username && styles.inputError]}
                    placeholder="Enter your username"
                    placeholderTextColor="#6b8a99"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="Enter your email"
                    placeholderTextColor="#6b8a99"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    placeholder="Enter your password"
                    placeholderTextColor="#6b8a99"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    style={[styles.input, errors.confirmPassword && styles.inputError]}
                    placeholder="Confirm your password"
                    placeholderTextColor="#6b8a99"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                {errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
            </View>

            {/* Register Button */}
            <Pressable
                style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.registerButtonText}>Create Account</Text>
                )}
            </Pressable>

            {/* Login Link */}
            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <Pressable onPress={() => router.replace("/(noHeaders)/welcome/login" as any)}>
                    <Text style={styles.loginLink}>Login</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#162b37",
    },
    contentContainer: {
        paddingHorizontal: 24,
        paddingTop: 50,
        paddingBottom: 40,
    },
    backButton: {
        marginBottom: 20,
    },
    backText: {
        color: "#8ba3b0",
        fontSize: 16,
    },
    title: {
        color: "white",
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 8,
    },
    subtitle: {
        color: "#8ba3b0",
        fontSize: 16,
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: "white",
        fontSize: 14,
        marginBottom: 8,
        fontWeight: "500",
    },
    input: {
        backgroundColor: "#1e3a4a",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: "white",
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#3a5060",
    },
    inputError: {
        borderColor: "#ff4444",
    },
    errorText: {
        color: "#ff4444",
        fontSize: 12,
        marginTop: 6,
    },
    registerButton: {
        backgroundColor: "#335FFF",
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    registerButtonDisabled: {
        backgroundColor: "#1e3a4a",
    },
    registerButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 24,
    },
    loginText: {
        color: "#8ba3b0",
        fontSize: 14,
    },
    loginLink: {
        color: "#335FFF",
        fontSize: 14,
        fontWeight: "500",
    },
});

export default RegisterCredentials;
