import { router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FindMatchFilters } from "@/features/findMatch/FindMatchFilters";
import { FindMatchHeader } from "@/features/findMatch/FindMatchHeader";
import { FindMatchList } from "@/features/findMatch/FindMatchList";
import {
  DEFAULT_FIND_MATCH_FILTERS,
  getFilteredMatches,
  getSportFilterLabel,
  getVisibleClubCount,
  getWeekdayFilterLabel,
} from "@/features/findMatch/filters/filterUtils";
import { useOpenMatches } from "@/features/findMatch/useOpenMatches";

const FindMatch = () => {
  // ------------------------------------------------------------
  // DATA STATE
  // ------------------------------------------------------------
  const { matches, clubs, favoriteLocationIds, loading, error } =
    useOpenMatches();
  const [filters, setFilters] = useState(DEFAULT_FIND_MATCH_FILTERS);

  const filteredMatches = useMemo(
    () => getFilteredMatches(matches, filters, favoriteLocationIds),
    [matches, filters, favoriteLocationIds],
  );

  const visibleClubCount = useMemo(
    () => getVisibleClubCount(clubs, filters, favoriteLocationIds),
    [clubs, filters, favoriteLocationIds],
  );

  const sportLabel = getSportFilterLabel(filters.sport);
  const clubsLabel = `${visibleClubCount} Clubs`;
  const daysLabel = getWeekdayFilterLabel(
    filters.selectedWeekdays,
    filters.timeFilter,
  );

  return (
    <View style={styles.container}>
      <FindMatchHeader />
      <FindMatchFilters
        filters={filters}
        sportLabel={sportLabel}
        clubsLabel={clubsLabel}
        daysLabel={daysLabel}
        availableClubCount={visibleClubCount}
        favoriteCount={favoriteLocationIds.length}
        onChangeSport={(sport) =>
          setFilters((prev) => ({
            ...prev,
            sport,
          }))
        }
        onChangeMaxDistanceKm={(maxDistanceKm) =>
          setFilters((prev) => ({
            ...prev,
            maxDistanceKm,
          }))
        }
        onToggleFavoriteOnly={(favoriteOnly) =>
          setFilters((prev) => ({
            ...prev,
            favoriteOnly,
          }))
        }
        onToggleWeekday={(weekday) =>
          setFilters((prev) => ({
            ...prev,
            selectedWeekdays: prev.selectedWeekdays.includes(weekday)
              ? prev.selectedWeekdays.filter((d) => d !== weekday)
              : [...prev.selectedWeekdays, weekday],
          }))
        }
        onChangeTimeFilter={(timeFilter) =>
          setFilters((prev) => ({
            ...prev,
            timeFilter,
          }))
        }
      />
      <FindMatchList
        loading={loading}
        error={error}
        matches={filteredMatches}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push("/(noHeaders)/bookCourt" as any)}
      >
        <Text style={styles.floatingButtonPlus}>+</Text>
        <Text style={styles.floatingButtonText}>Start a match</Text>
      </TouchableOpacity>
    </View>
  );
};

// ------------------------------------------------------------
// STYLES
// ------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#335FFF",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 30,
    gap: 8,
    shadowColor: "#335FFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingButtonPlus: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },
  floatingButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});

export default FindMatch;
