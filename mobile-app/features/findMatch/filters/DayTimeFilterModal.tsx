import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnimatedBottomSheetModal } from "./AnimatedBottomSheetModal";
import { TimeFilter } from "../types";

type DayTimeFilterModalProps = {
  visible: boolean;
  selectedWeekdays: number[];
  selectedTimeFilter: TimeFilter;
  onClose: () => void;
  onToggleWeekday: (dayIndex: number) => void;
  onSelectTime: (time: TimeFilter) => void;
};

const WEEKDAYS = [
  { id: 1, short: "MON" },
  { id: 2, short: "TUE" },
  { id: 3, short: "WED" },
  { id: 4, short: "THU" },
  { id: 5, short: "FRI" },
  { id: 6, short: "SAT" },
  { id: 0, short: "SUN" },
];

const TIME_OPTIONS: { key: TimeFilter; label: string; range: string }[] = [
  { key: "all", label: "All day", range: "" },
  { key: "morning", label: "Morning", range: "06:00 - 12:00" },
  { key: "afternoon", label: "Afternoon", range: "12:00 - 18:00" },
  { key: "evening", label: "Evening", range: "18:00 - 24:00" },
];

export const DayTimeFilterModal = ({
  visible,
  selectedWeekdays,
  selectedTimeFilter,
  onClose,
  onToggleWeekday,
  onSelectTime,
}: DayTimeFilterModalProps) => {
  return (
    <AnimatedBottomSheetModal
      visible={visible}
      onClose={onClose}
      sheetStyle={styles.sheet}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>When do you want to play?</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeIcon}>x</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Choose your days</Text>
      <View style={styles.daysRow}>
        {WEEKDAYS.map((day) => {
          const selected = selectedWeekdays.includes(day.id);
          return (
            <TouchableOpacity
              key={day.id}
              style={[styles.dayPill, selected && styles.dayPillSelected]}
              onPress={() => onToggleWeekday(day.id)}
            >
              <Text
                style={[styles.dayText, selected && styles.dayTextSelected]}
              >
                {day.short}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Choose your time</Text>
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
    padding: 24,
    gap: 16,
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
  sectionTitle: {
    fontSize: 17,
    color: "#162b37",
    fontWeight: "700",
  },
  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dayPill: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#CFD3D8",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dayPillSelected: {
    borderColor: "#0d2432",
    backgroundColor: "#0d2432",
  },
  dayText: {
    color: "#4B5563",
    fontWeight: "600",
    fontSize: 13,
  },
  dayTextSelected: {
    color: "#fff",
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
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: "#335FFF",
  },
  radioSelected: {
    backgroundColor: "#335FFF",
  },
  timeLabel: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "600",
    width: 104,
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
