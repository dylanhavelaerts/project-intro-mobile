import { useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SPORTS = ["Padel", "Tennis"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "Pro"];

const RegisterStep1 = () => {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedSport && selectedLevel) {
      router.push({
        pathname: "/(noHeaders)/welcome/register/credentials",
        params: { sport: selectedSport, level: selectedLevel },
      });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <Text style={styles.greeting}>Hello!</Text>
      <Text style={styles.subtitle}>
        Complete your profile to start playing
      </Text>

      {/* Profile Photo */}
      <Pressable style={styles.photoContainer}>
        <View style={styles.photoPlaceholder}>
          <Ionicons name="person-outline" size={50} color="#6b8a99" />
        </View>
        <Text style={styles.photoText}>Upload your best photo</Text>
      </Pressable>

      {/* Sport Selection */}
      <Text style={styles.sectionTitle}>
        Select your favourite sport and level
      </Text>
      <View style={styles.optionsRow}>
        {SPORTS.map((sport) => (
          <Pressable
            key={sport}
            style={[
              styles.optionButton,
              selectedSport === sport && styles.optionButtonSelected,
            ]}
            onPress={() => setSelectedSport(sport)}
          >
            <Ionicons
              name={sport === "Padel" ? "tennisball-outline" : "tennisball"}
              size={18}
              color={selectedSport === sport ? "#335FFF" : "#6b8a99"}
            />
            <Text
              style={[
                styles.optionText,
                selectedSport === sport && styles.optionTextSelected,
              ]}
            >
              {sport}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Level Selection */}
      <View style={styles.optionsRow}>
        {LEVELS.map((level) => (
          <Pressable
            key={level}
            style={[
              styles.levelButton,
              selectedLevel === level && styles.optionButtonSelected,
            ]}
            onPress={() => setSelectedLevel(level)}
          >
            <Text
              style={[
                styles.optionText,
                selectedLevel === level && styles.optionTextSelected,
              ]}
            >
              {level}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[
          styles.continueButton,
          (!selectedSport || !selectedLevel) && styles.continueButtonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!selectedSport || !selectedLevel}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </Pressable>
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
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
  },
  greeting: {
    color: "white",
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    color: "#8ba3b0",
    fontSize: 16,
    marginBottom: 40,
    textAlign: "center",
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#3a5060",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  photoText: {
    color: "#8ba3b0",
    fontSize: 14,
  },
  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 20,
    textAlign: "center",
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#3a5060",
    gap: 8,
  },
  levelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3a5060",
  },
  optionButtonSelected: {
    borderColor: "#335FFF",
    backgroundColor: "rgba(51, 95, 255, 0.1)",
  },
  optionText: {
    color: "#8ba3b0",
    fontSize: 14,
  },
  optionTextSelected: {
    color: "#335FFF",
  },
  continueButton: {
    backgroundColor: "#335FFF",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginTop: 30,
  },
  continueButtonDisabled: {
    backgroundColor: "#1e3a4a",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RegisterStep1;
