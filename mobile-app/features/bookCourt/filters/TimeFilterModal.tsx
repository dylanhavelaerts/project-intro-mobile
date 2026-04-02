import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnimatedBottomSheetModal } from "./AnimatedBottomSheetModal";
import { BookingTimeFilter } from "./types";

type TimeFilterModalProps = {
  visible: boolean;
  selectedTimeFilter: BookingTimeFilter;
  onClose: () => void;
  onSelectTime: (timeFilter: BookingTimeFilter) => void;
};

const TIME_OPTIONS: { key: BookingTimeFilter; label: string; range: string }[] =
  [
    { key: "all", label: "All day", range: "" },
    { key: "morning", label: "Morning", range: "06:00 - 12:00" },
    { key: "afternoon", label: "Afternoon", range: "12:00 - 18:00" },
    { key: "evening", label: "Evening", range: "18:00 - 24:00" },
  ];

export const TimeFilterModal = ({
  visible,
  selectedTimeFilter,
  onClose,
  onSelectTime,
}: TimeFilterModalProps) => {
  return (
    <AnimatedBottomSheetModal
      visible={visible}
      onClose={onClose}
      sheetStyle={styles.sheet}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>What time do you want to play?</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeIcon}>x</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timeList}>
        {TIME_OPTIONS.map((option) => {
          const selected = selectedTimeFilter === option.key;
          return (
            <TouchableOpacity
              key={option.key}
              style={styles.timeOptionRow}
              onPress={() => onSelectTime(option.key)}
            >
              <View style={[styles.radio, selected && styles.radioSelected]} />
              <Text style={styles.timeLabel}>{option.label}</Text>
              {option.range ? (
                <Text style={styles.timeRange}>{option.range}</Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>

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
  timeList: {
    gap: 12,
    marginBottom: 6,
  },
  timeOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
  timeLabel: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "600",
    width: 92,
  },
  timeRange: {
    fontSize: 16,
    color: "#6B7280",
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
