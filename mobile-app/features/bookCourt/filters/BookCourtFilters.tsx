import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getDateLabel, getSportLabel, getTimeFilterLabel } from "./filterUtils";
import { BookDateFilterModal } from "./BookDateFilterModal";
import { SportFilterModal } from "./SportFilterModal";
import { TimeFilterModal } from "./TimeFilterModal";
import {
  BookCourtFiltersState,
  BookingTimeFilter,
  BookCourtSport,
} from "./types";

type BookCourtFiltersProps = {
  filters: BookCourtFiltersState;
  onChangeSport: (sport: BookCourtSport) => void;
  onChangeDate: (date: Date) => void;
  onChangeTimeFilter: (timeFilter: BookingTimeFilter) => void;
};

export const BookCourtFilters = ({
  filters,
  onChangeSport,
  onChangeDate,
  onChangeTimeFilter,
}: BookCourtFiltersProps) => {
  const [activeModal, setActiveModal] = useState<
    "sport" | "date" | "time" | null
  >(null);

  return (
    <>
      <View style={styles.filterSection}>
        <Image
          source={require("@/assets/images/bookCourt/settings-sliders.png")}
          style={styles.settingsIcon}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <TouchableOpacity
            style={styles.filterPill}
            onPress={() => setActiveModal("sport")}
          >
            <Text style={styles.filterText}>
              {getSportLabel(filters.sport)}
            </Text>
            <Image
              source={require("@/assets/images/bookCourt/arrow-down.png")}
              style={styles.downArrowIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterPill}
            onPress={() => setActiveModal("date")}
          >
            <Text style={styles.filterText}>
              {getDateLabel(filters.selectedDate)}
            </Text>
            <Image
              source={require("@/assets/images/bookCourt/arrow-down.png")}
              style={styles.downArrowIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterPill}
            onPress={() => setActiveModal("time")}
          >
            <Text style={styles.filterText}>
              {getTimeFilterLabel(filters.timeFilter)}
            </Text>
            <Image
              source={require("@/assets/images/bookCourt/arrow-down.png")}
              style={styles.downArrowIcon}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>

      <SportFilterModal
        visible={activeModal === "sport"}
        selectedSport={filters.sport}
        onClose={() => setActiveModal(null)}
        onSelectSport={onChangeSport}
      />

      <BookDateFilterModal
        visible={activeModal === "date"}
        selectedDate={filters.selectedDate}
        onClose={() => setActiveModal(null)}
        onSelectDate={onChangeDate}
      />

      <TimeFilterModal
        visible={activeModal === "time"}
        selectedTimeFilter={filters.timeFilter}
        onClose={() => setActiveModal(null)}
        onSelectTime={onChangeTimeFilter}
      />
    </>
  );
};

const styles = StyleSheet.create({
  filterSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    paddingVertical: 10,
  },
  filterScrollContent: {
    gap: 10,
    paddingRight: 20,
  },
  settingsIcon: {
    height: 20,
    width: 20,
    marginRight: 12,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d2432",
    paddingRight: 8,
    paddingLeft: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  filterText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  downArrowIcon: {
    height: 14,
    width: 14,
    tintColor: "white",
  },
});
