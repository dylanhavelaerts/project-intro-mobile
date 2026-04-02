import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnimatedBottomSheetModal } from "./AnimatedBottomSheetModal";
import { BookCourtSport } from "./types";

type SportFilterModalProps = {
  visible: boolean;
  selectedSport: BookCourtSport;
  onClose: () => void;
  onSelectSport: (sport: BookCourtSport) => void;
};

export const SportFilterModal = ({
  visible,
  selectedSport,
  onClose,
  onSelectSport,
}: SportFilterModalProps) => {
  return (
    <AnimatedBottomSheetModal
      visible={visible}
      onClose={onClose}
      sheetStyle={styles.sheet}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>What sport do you want to play?</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeIcon}>x</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => {
          onSelectSport("padel");
        }}
      >
        <View
          style={[
            styles.radio,
            selectedSport === "padel" && styles.radioSelected,
          ]}
        />
        <Text style={styles.optionText}>Padel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => {
          onSelectSport("tennis");
        }}
      >
        <View
          style={[
            styles.radio,
            selectedSport === "tennis" && styles.radioSelected,
          ]}
        />
        <Text style={styles.optionText}>Tennis</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onClose}>
        <Text style={styles.buttonText}>See results</Text>
      </TouchableOpacity>
    </AnimatedBottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    padding: 20,
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#162b37",
    maxWidth: "88%",
  },
  closeIcon: {
    fontSize: 28,
    color: "#9AA3AF",
    lineHeight: 28,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#335FFF",
    backgroundColor: "white",
  },
  radioSelected: {
    backgroundColor: "#335FFF",
    borderColor: "#335FFF",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
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
