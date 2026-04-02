import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import CourtCard from "../../../components/CourtCard";
import { BookCourtFilters } from "@/features/bookCourt/filters/BookCourtFilters";
import {
  dateKey,
  DEFAULT_BOOK_COURT_FILTERS,
} from "@/features/bookCourt/filters/filterUtils";
import { getVisibleBookCourts } from "@/features/bookCourt/selectors";
import { BookCourtIconFilter } from "@/features/bookCourt/types";
import { useBookCourtData } from "@/features/bookCourt/useBookCourtData";

const BookCourt = () => {
  const [activeIcon, setActiveIcon] = useState<BookCourtIconFilter>("location");
  const [filters, setFilters] = useState(DEFAULT_BOOK_COURT_FILTERS);
  const { loading, courts, favoriteIds, toggleFavorite } = useBookCourtData();

  const courtsToShow = useMemo(
    () =>
      getVisibleBookCourts({
        courts,
        filters,
        favoriteIds,
        activeIcon,
      }),
    [activeIcon, courts, favoriteIds, filters],
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerSide}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require("../../../assets/images/bookCourt/back.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>Search</Text>
        <View style={[styles.headerSide, styles.headerSideRight]}>
          <Text style={styles.headerSideText}>View map</Text>
        </View>
      </View>
      <View style={styles.searchbarContainer}>
        <Image
          source={require("../../../assets/images/bookCourt/search.png")}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Around me"
          placeholderTextColor="#1a2436"
        />
        <View style={styles.inputText}>
          <TouchableOpacity
            onPress={() => setActiveIcon("location")}
            activeOpacity={0.7}
          >
            <Image
              source={
                activeIcon === "location"
                  ? require("../../../assets/images/bookCourt/location-arrow-black.png")
                  : require("../../../assets/images/bookCourt/location-arrow.png")
              }
              style={styles.rightIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setActiveIcon((prev) => (prev === "heart" ? "location" : "heart"))
            }
            activeOpacity={0.7}
          >
            <Image
              source={
                activeIcon === "heart"
                  ? require("../../../assets/images/bookCourt/heart-black.png")
                  : require("../../../assets/images/bookCourt/heart.png")
              }
              style={styles.rightIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <BookCourtFilters
        filters={filters}
        onChangeSport={(sport) =>
          setFilters((prev) => ({
            ...prev,
            sport,
          }))
        }
        onChangeDate={(selectedDate) =>
          setFilters((prev) => ({
            ...prev,
            selectedDate,
          }))
        }
        onChangeTimeFilter={(timeFilter) =>
          setFilters((prev) => ({
            ...prev,
            timeFilter,
          }))
        }
      />

      <ScrollView
        style={styles.courtSection}
        contentContainerStyle={styles.courtSectionContent}
        showsVerticalScrollIndicator={false}
      >
        {courtsToShow.length > 0 ? (
          courtsToShow.map((court) => (
            <TouchableOpacity
              key={court.id}
              activeOpacity={0.9}
              onPress={() =>
                router.push(
                  `/(noHeaders)/makeMatch/${court.id}?date=${dateKey(filters.selectedDate)}` as any,
                )
              }
            >
              <CourtCard court={court} onToggleFavorite={toggleFavorite} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No favorites yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the heart on a court to add it to your favorites
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // HEADER
  headerContainer: {
    flexDirection: "row",
    padding: 25,
    marginTop: 25,
    alignItems: "center",
    paddingBottom: 0,
  },
  headerSide: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerSideRight: {
    alignItems: "flex-end",
  },
  headerIcon: {
    height: 32,
    width: 32,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "500",
  },
  headerSideText: {
    color: "blue",
    fontWeight: "600",
    fontSize: 16,
  },
  searchbarContainer: {
    backgroundColor: "#ececec",
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 25,
    marginRight: 25,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchIcon: {
    height: 20,
    width: 20,
    marginRight: 12,
  },
  inputText: {
    flexDirection: "row",
    gap: 10,
  },
  rightIcon: {
    height: 20,
    width: 20,
    marginRight: 5,
  },

  courtSection: {
    flex: 1,
    marginTop: 10,
  },
  courtSectionContent: {
    paddingBottom: 30,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0d2432",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});

export default BookCourt;
