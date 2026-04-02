import { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedBottomSheetModal } from "./AnimatedBottomSheetModal";
import { dateKey, getDateLabel, getSelectableDates } from "./filterUtils";

type BookDateFilterModalProps = {
  visible: boolean;
  selectedDate: Date;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
};

export const BookDateFilterModal = ({
  visible,
  selectedDate,
  onClose,
  onSelectDate,
}: BookDateFilterModalProps) => {
  const dates = useMemo(() => getSelectableDates(21), []);
  const selectedKey = dateKey(selectedDate);

  return (
    <AnimatedBottomSheetModal
      visible={visible}
      onClose={onClose}
      sheetStyle={styles.sheet}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>When do you want to book?</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeIcon}>x</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Choose a date</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysRow}
      >
        {dates.map((date) => {
          const key = dateKey(date);
          const isSelected = key === selectedKey;
          const weekday = date
            .toLocaleDateString("en-US", { weekday: "short" })
            .toUpperCase();

          return (
            <TouchableOpacity
              key={key}
              style={[styles.dayCard, isSelected && styles.dayCardSelected]}
              onPress={() => onSelectDate(date)}
            >
              <Text
                style={[
                  styles.weekdayText,
                  isSelected && styles.dayTextSelected,
                ]}
              >
                {weekday}
              </Text>
              <Text
                style={[styles.dateText, isSelected && styles.dayTextSelected]}
              >
                {getDateLabel(date)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

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
    gap: 10,
    paddingRight: 8,
  },
  dayCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CFD3D8",
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 90,
    alignItems: "center",
  },
  dayCardSelected: {
    backgroundColor: "#0d2432",
    borderColor: "#0d2432",
  },
  weekdayText: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
  },
  dateText: {
    color: "#1f2937",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  dayTextSelected: {
    color: "#fff",
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
