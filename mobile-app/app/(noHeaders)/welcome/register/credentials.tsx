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
import { useRegisterCredentialsForm } from "@/features/welcome/hooks/useRegisterCredentialsForm";

const getRegisterErrorMessage = (errorCode: string) => {
  if (errorCode === "auth/email-already-in-use") {
    return "This email is already registered.";
  }
  if (errorCode === "auth/invalid-email") {
    return "Invalid email address.";
  }
  if (errorCode === "auth/weak-password") {
    return "Password is too weak.";
  }

  return "Registration failed. Please try again.";
};

const RegisterCredentials = () => {
  const { sport, level } = useLocalSearchParams<{
    sport: string;
    level: string;
  }>();

  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    errors,
    submit,
  } = useRegisterCredentialsForm({
    sport: sport ?? "Padel",
    level: level ?? "Beginner",
  });

  const handleRegister = async () => {
    const result = await submit();

    if (result.ok) {
      router.replace("/(noHeaders)/welcome/login" as any);
      Alert.alert("Success", "Account created successfully! Please log in.");
      return;
    }

    if (result.errorCode === "validation") return;

    Alert.alert("Error", getRegisterErrorMessage(result.errorCode));
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
        {errors.username && (
          <Text style={styles.errorText}>{errors.username}</Text>
        )}
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
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
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
        style={[
          styles.registerButton,
          loading && styles.registerButtonDisabled,
        ]}
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
        <Pressable
          onPress={() => router.replace("/(noHeaders)/welcome/login" as any)}
        >
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
