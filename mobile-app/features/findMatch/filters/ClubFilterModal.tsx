import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { AnimatedBottomSheetModal } from "./AnimatedBottomSheetModal";

type ClubFilterModalProps = {
  visible: boolean;
  maxDistanceKm: number;
  favoriteOnly: boolean;
  availableClubCount: number;
  favoriteCount: number;
  onClose: () => void;
  onChangeDistance: (value: number) => void;
  onToggleFavoriteOnly: (value: boolean) => void;
};

const DISTANCE_STEPS = [5, 10, 15, 20, 30, 40, 50];

export const ClubFilterModal = ({
  visible,
  maxDistanceKm,
  favoriteOnly,
  availableClubCount,
  favoriteCount,
  onClose,
  onChangeDistance,
  onToggleFavoriteOnly,
}: ClubFilterModalProps) => {
  return (
    <AnimatedBottomSheetModal
      visible={visible}
      onClose={onClose}
      sheetStyle={styles.sheet}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>Where do you want to play?</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeIcon}>x</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionRow}>
        <View>
          <Text style={styles.sectionLabel}>Favorite clubs only</Text>
          <Text style={styles.sectionHint}>{favoriteCount} saved</Text>
        </View>
        <Switch
          value={favoriteOnly}
          onValueChange={onToggleFavoriteOnly}
          trackColor={{ false: "#D1D5DB", true: "#AFC2FF" }}
          thumbColor={favoriteOnly ? "#335FFF" : "#f4f3f4"}
        />
      </View>

      <Text style={styles.sectionLabel}>Select a distance</Text>
      <View style={styles.distanceRow}>
        {DISTANCE_STEPS.map((step) => (
          <TouchableOpacity
            key={step}
            style={[
              styles.distancePill,
              maxDistanceKm === step && styles.distancePillActive,
            ]}
            onPress={() => onChangeDistance(step)}
          >
            <Text
              style={[
                styles.distancePillText,
                maxDistanceKm === step && styles.distancePillTextActive,
              ]}
            >
              {step}km
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.resultBox}>
        <Text style={styles.resultText}>
          {availableClubCount} clubs fit this criteria
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onClose}>
        <Text style={styles.buttonText}>See results</Text>
      </TouchableOpacity>
    </AnimatedBottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    padding: 24,
    gap: 18,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#162b37",
    maxWidth: "88%",
  },
  closeIcon: {
    fontSize: 32,
    color: "#9AA3AF",
    lineHeight: 32,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  sectionLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1f2937",
  },
  sectionHint: {
    fontSize: 14,
    color: "#6B7280",
  },
  distanceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  distancePill: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  distancePillActive: {
    borderColor: "#335FFF",
    backgroundColor: "#335FFF",
  },
  distancePillText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
  distancePillTextActive: {
    color: "#fff",
  },
  resultBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  resultText: {
    color: "#162b37",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#335FFF",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
