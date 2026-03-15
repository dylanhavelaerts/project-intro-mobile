import { router } from "expo-router";
import { useEffect, useState } from "react";
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
import CourtCard, { CourtData } from "../../../components/CourtCard";
import { db } from "@/config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const BookCourt = () => {
  const [activeIcon, setActiveIcon] = useState<"location" | "heart">(
    "location",
  );
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [courts, setCourts] = useState<CourtData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locSnap, courtsSnap] = await Promise.all([
          getDocs(collection(db, "locations")),
          getDocs(collection(db, "courts")),
        ]);

        const courtsByLocation: Record<
          string,
          { pricePerSlot: number; slotDurationMinutes: number }[]
        > = {};
        courtsSnap.forEach((doc) => {
          const d = doc.data();
          if (!courtsByLocation[d.locationId])
            courtsByLocation[d.locationId] = [];
          courtsByLocation[d.locationId].push(d as any);
        });

        const mapped: CourtData[] = locSnap.docs.map((doc) => {
          const loc = doc.data();
          const locCourts = courtsByLocation[doc.id] ?? [];
          const minPrice =
            locCourts.length > 0
              ? Math.min(...locCourts.map((c) => c.pricePerSlot))
              : 0;
          const duration = locCourts[0]?.slotDurationMinutes
            ? `${locCourts[0].slotDurationMinutes}min`
            : "90min";

          return {
            id: doc.id,
            name: loc.name,
            image: { uri: loc.imageUrl },
            price: `€ ${minPrice}`,
            duration,
            distance: loc.city,
            location: `${loc.address}, ${loc.city}`,
            timeSlots: [],
          };
        });

        setCourts(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id],
    );
  };

  const courtsToShow = courts
    .map((court) => ({ ...court, isFavorite: favoriteIds.includes(court.id) }))
    .filter((court) => (activeIcon === "heart" ? court.isFavorite : true));

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
            onPress={() => setActiveIcon("heart")}
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
      <View style={styles.filterSection}>
        <Image
          source={require("../../../assets/images/bookCourt/settings-sliders.png")}
          style={styles.settingsIcon}
        />
        <TouchableOpacity style={styles.filterPill}>
          <Text style={styles.filterText}>Padel</Text>
          <Image
            source={require("../../../assets/images/bookCourt/arrow-down.png")}
            style={styles.downArrowIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterPill}>
          <Text style={styles.filterText}>04 Mar</Text>
          <Image
            source={require("../../../assets/images/bookCourt/arrow-down.png")}
            style={styles.downArrowIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterPill}>
          <Text style={styles.filterText}>00:00 - 23:59</Text>
          <Image
            source={require("../../../assets/images/bookCourt/arrow-down.png")}
            style={styles.downArrowIcon}
          />
        </TouchableOpacity>
      </View>

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
                router.push(`/(noHeaders)/makeMatch/${court.id}` as any)
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

  // FILTER SECTION
  filterSection: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 25,
    gap: 12,
  },
  settingsIcon: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d2432",
    paddingRight: 6,
    paddingLeft: 12,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  filterText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  downArrowIcon: {
    height: 16,
    width: 16,
    marginTop: 2,
    tintColor: "white",
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
