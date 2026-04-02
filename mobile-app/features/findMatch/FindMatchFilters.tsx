import {
  Image,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { ClubFilterModal } from "./filters/ClubFilterModal";
import { DayTimeFilterModal } from "./filters/DayTimeFilterModal";
import { SportFilterModal } from "./filters/SportFilterModal";
import { FindMatchFiltersState, MatchSport, TimeFilter } from "./types";

type FindMatchFiltersProps = {
  filters: FindMatchFiltersState;
  sportLabel: string;
  clubsLabel: string;
  daysLabel: string;
  availableClubCount: number;
  favoriteCount: number;
  onChangeSport: (sport: MatchSport) => void;
  onChangeMaxDistanceKm: (value: number) => void;
  onToggleFavoriteOnly: (value: boolean) => void;
  onToggleWeekday: (weekday: number) => void;
  onChangeTimeFilter: (timeFilter: TimeFilter) => void;
};

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export const FindMatchFilters = ({
  filters,
  sportLabel,
  clubsLabel,
  daysLabel,
  availableClubCount,
  favoriteCount,
  onChangeSport,
  onChangeMaxDistanceKm,
  onToggleFavoriteOnly,
  onToggleWeekday,
  onChangeTimeFilter,
}: FindMatchFiltersProps) => {
  const [activeModal, setActiveModal] = useState<
    "sport" | "clubs" | "days" | null
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
            <Text style={styles.filterText}>{sportLabel}</Text>
            <Image
              source={require("@/assets/images/bookCourt/arrow-down.png")}
              style={styles.downArrowIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterPill}
            onPress={() => setActiveModal("clubs")}
          >
            <Text style={styles.filterText}>{clubsLabel}</Text>
            <Image
              source={require("@/assets/images/bookCourt/arrow-down.png")}
              style={styles.downArrowIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterPill}
            onPress={() => setActiveModal("days")}
          >
            <Text style={styles.filterText}>{daysLabel}</Text>
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

      <ClubFilterModal
        visible={activeModal === "clubs"}
        maxDistanceKm={filters.maxDistanceKm}
        favoriteOnly={filters.favoriteOnly}
        availableClubCount={availableClubCount}
        favoriteCount={favoriteCount}
        onClose={() => setActiveModal(null)}
        onChangeDistance={onChangeMaxDistanceKm}
        onToggleFavoriteOnly={onToggleFavoriteOnly}
      />

      <DayTimeFilterModal
        visible={activeModal === "days"}
        selectedWeekdays={filters.selectedWeekdays}
        selectedTimeFilter={filters.timeFilter}
        onClose={() => setActiveModal(null)}
        onToggleWeekday={onToggleWeekday}
        onSelectTime={onChangeTimeFilter}
      />
    </>
  );
};

// ------------------------------------------------------------
// STYLES
// ------------------------------------------------------------
const styles = StyleSheet.create({
  filterSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#cfcfcf",
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
