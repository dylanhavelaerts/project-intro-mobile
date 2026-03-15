import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import type { Court, Location } from "@/types";

const { width } = Dimensions.get("window");

type Booking = {
  id: string;
  locationId: string;
  courtId: string;

  // We store bookings per-day using a local YYYY-MM-DD key.
  // This keeps the query simple for the project and avoids dealing with time zones early on.
  dateKey: string;

  // Minutes since midnight (local day)
  startMinute: number;
  endMinute: number;

  durationMinutes: 60 | 90 | 120;
  status: "confirmed" | "cancelled";
};

const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));

const toDateKeyLocal = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

const parseHHMMToMinutes = (hhmm: string) => {
  const [h, m] = hhmm
    .trim()
    .split(":")
    .map((v) => Number(v));

  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
};

const minutesToHHMM = (totalMinutes: number) => {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${pad2(h)}:${pad2(m)}`;
};

const overlaps = (aStart: number, aEnd: number, bStart: number, bEnd: number) =>
  aStart < bEnd && aEnd > bStart;

// Supports "08:00 - 23:00"
const parseOpeningHours = (openingHours?: string | null) => {
  if (!openingHours) return { open: 8 * 60, close: 23 * 60 };

  const parts = openingHours.split("-");
  if (parts.length < 2) return { open: 8 * 60, close: 23 * 60 };

  const open = parseHHMMToMinutes(parts[0]);
  const close = parseHHMMToMinutes(parts[1]);

  return {
    open: open ?? 8 * 60,
    close: close ?? 23 * 60,
  };
};

export default function VenueMakeMatch() {
  const params = useLocalSearchParams<{ locationId?: string | string[] }>();
  const locationId =
    typeof params.locationId === "string"
      ? params.locationId
      : Array.isArray(params.locationId)
        ? params.locationId[0]
        : undefined;

  // ------------------------------------------------------------
  // UI STATE (kept close to the skeleton)
  // ------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<
    "Home" | "Book" | "Open Matches" | "Competitions"
  >("Book");

  const [showAvailable, setShowAvailable] = useState(true);
  const [durationMinutes, setDurationMinutes] = useState<60 | 90 | 120>(90);

  // Selected day (we keep it as a Date so we can generate a correct dateKey)
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Slots shown in the horizontal scroll (same idea as the skeleton)
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");

  // ------------------------------------------------------------
  // DATA STATE
  // ------------------------------------------------------------
  const [location, setLocation] = useState<Location | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingBusy, setBookingBusy] = useState(false);

  const dateKey = toDateKeyLocal(selectedDate);

  // ------------------------------------------------------------
  // UI HELPERS (same pattern as generateDays in the skeleton)
  // ------------------------------------------------------------
  const generateDays = () => {
    const days: { day: string; date: number; month: string; fullDate: Date }[] =
      [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setHours(0, 0, 0, 0);
      d.setDate(today.getDate() + i);

      days.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
        date: d.getDate(),
        month: d.toLocaleDateString("en-US", { month: "short" }),
        fullDate: d,
      });
    }

    return days;
  };

  // ------------------------------------------------------------
  // LOAD LOCATION + COURTS (venue detail)
  // ------------------------------------------------------------
  useEffect(() => {
    const loadVenue = async () => {
      if (!locationId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Load venue + its courts in parallel.
        const [locSnap, courtsSnap] = await Promise.all([
          getDoc(doc(db, "locations", locationId)),
          getDocs(
            query(
              collection(db, "courts"),
              where("locationId", "==", locationId),
            ),
          ),
        ]);

        if (!locSnap.exists()) {
          setLocation(null);
          setCourts([]);
          return;
        }

        setLocation({ id: locSnap.id, ...(locSnap.data() as any) });
        setCourts(
          courtsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })),
        );
      } catch (e) {
        Alert.alert("Error", String(e));
      } finally {
        setLoading(false);
      }
    };

    loadVenue();
  }, [locationId]);

  // ------------------------------------------------------------
  // GENERATE TIME SLOTS (based on openingHours + selected duration)
  // ------------------------------------------------------------
  useEffect(() => {
    const { open, close } = parseOpeningHours(location?.openingHours ?? null);

    // Playtomic-like grid: start times in 30-minute steps.
    const step = 30;
    const slots: string[] = [];

    for (let t = open; t + durationMinutes <= close; t += step) {
      slots.push(minutesToHHMM(t));
    }

    setTimeSlots(slots);

    // Make sure we always have a valid selected time.
    if (slots.length > 0) {
      if (!selectedTime || !slots.includes(selectedTime))
        setSelectedTime(slots[0]);
    } else {
      setSelectedTime("");
    }
  }, [location?.openingHours, durationMinutes]);

  // ------------------------------------------------------------
  // LOAD BOOKINGS FOR THIS VENUE + DAY
  // ------------------------------------------------------------
  const fetchBookingsForDay = async () => {
    if (!locationId) return [];

    // We only load bookings for the currently selected day.
    // Availability is then computed client-side per court.
    const snap = await getDocs(
      query(
        collection(db, "bookings"),
        where("locationId", "==", locationId),
        where("dateKey", "==", dateKey),
        where("status", "==", "confirmed"),
      ),
    );

    const mapped: Booking[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));

    setBookings(mapped);
    return mapped;
  };

  useEffect(() => {
    fetchBookingsForDay().catch((e) => Alert.alert("Error", String(e)));
    // Intentionally only depends on venue + day.
  }, [locationId, dateKey]);

  // ------------------------------------------------------------
  // AVAILABILITY + BOOKING
  // ------------------------------------------------------------
  const getSelectedStartMinute = () => {
    if (!selectedTime) return null;
    return parseHHMMToMinutes(selectedTime);
  };

  const isCourtAvailable = (courtId: string) => {
    const startMinute = getSelectedStartMinute();
    if (startMinute == null) return false;

    const endMinute = startMinute + durationMinutes;

    const hasOverlap = bookings.some(
      (b) =>
        b.courtId === courtId &&
        overlaps(b.startMinute, b.endMinute, startMinute, endMinute),
    );

    return !hasOverlap;
  };

  const priceForDuration = (court: Court) => {
    // We only have a price per default slot in Firestore.
    // For 60/90/120 we scale linearly so the UI can show a consistent price.
    const perMinute =
      court.slotDurationMinutes > 0
        ? court.pricePerSlot / court.slotDurationMinutes
        : 0;

    const price = perMinute * durationMinutes;
    return `€ ${price.toFixed(2)}`;
  };

  const handleBook = async (court: Court) => {
    if (!locationId) return;

    const startMinute = getSelectedStartMinute();
    if (startMinute == null) {
      Alert.alert("Pick a time", "Please select a start time first.");
      return;
    }

    const endMinute = startMinute + durationMinutes;

    try {
      setBookingBusy(true);

      // Firestore-backed check: re-fetch right before writing.
      // This prevents booking something that became unavailable seconds ago.
      const latest = await fetchBookingsForDay();
      const conflict = latest.some(
        (b) =>
          b.courtId === court.id &&
          overlaps(b.startMinute, b.endMinute, startMinute, endMinute),
      );

      if (conflict) {
        Alert.alert(
          "Not available",
          "Someone just booked this slot. Pick another time.",
        );
        return;
      }

      await addDoc(collection(db, "bookings"), {
        locationId,
        courtId: court.id,
        dateKey,
        startMinute,
        endMinute,
        durationMinutes,
        status: "confirmed",

        // Payment is simulated for the assignment.
        // We still store who booked it so we can extend this later.
        createdBy: auth.currentUser?.uid ?? "anonymous",
        createdAt: serverTimestamp(),
      });

      await fetchBookingsForDay();

      Alert.alert(
        "Booked!",
        `${court.name} at ${minutesToHHMM(startMinute)} (${durationMinutes}min)`,
      );
    } catch (e) {
      Alert.alert("Error", String(e));
    } finally {
      setBookingBusy(false);
    }
  };

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!locationId || !location) {
    return (
      <View style={styles.loading}>
        <Text style={{ fontWeight: "600" }}>Venue not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: location.imageUrl }} style={styles.padelvenue} />

      <View style={styles.totalaboveview}>
        <View style={styles.viewstyle}>
          <View style={styles.venueInfo}>
            <Text style={styles.venuetitle}>{location.name}</Text>
            <Text style={styles.venueadress}>
              {location.address}, {location.city}
            </Text>
          </View>

          {/* Placeholder favourite UI (not wired yet) */}
          <Text style={{ fontSize: 20 }}>♡</Text>
        </View>

        <View style={styles.viewstyletwo}>
          <Pressable
            onPress={() => {
              setActiveTab("Home");
            }}
          >
            <Text
              style={activeTab == "Home" ? styles.activeTab : styles.tabText}
            >
              Home
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setActiveTab("Book");
            }}
          >
            <Text
              style={activeTab == "Book" ? styles.activeTab : styles.tabText}
            >
              Book
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setActiveTab("Open Matches");
            }}
          >
            <Text
              style={
                activeTab == "Open Matches" ? styles.activeTab : styles.tabText
              }
            >
              Open Matches
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setActiveTab("Competitions");
            }}
          >
            <Text
              style={
                activeTab == "Competitions" ? styles.activeTab : styles.tabText
              }
            >
              Competitions
            </Text>
          </Pressable>
        </View>

        {activeTab == "Book" && (
          <View style={{ backgroundColor: "#f5f5f5" }}>
            <ScrollView horizontal style={{ padding: 10 }}>
              {generateDays().map((item) => (
                <Pressable
                  key={toDateKeyLocal(item.fullDate)}
                  onPress={() => setSelectedDate(item.fullDate)}
                >
                  <View style={styles.dayCard}>
                    <Text>{item.day}</Text>

                    <View
                      style={[
                        styles.circle,
                        toDateKeyLocal(item.fullDate) === dateKey &&
                          styles.selectedCircle,
                      ]}
                    >
                      <Text
                        style={
                          toDateKeyLocal(item.fullDate) === dateKey
                            ? { color: "white" }
                            : undefined
                        }
                      >
                        {item.date}
                      </Text>
                    </View>

                    <Text>{item.month}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.toggleRow}>
              <Text>Show available courts only</Text>
              <Switch value={showAvailable} onValueChange={setShowAvailable} />
            </View>

            <View style={styles.durationRow}>
              {[60, 90, 120].map((d) => {
                const selected = durationMinutes === d;

                return (
                  <Pressable
                    key={d}
                    onPress={() => setDurationMinutes(d as 60 | 90 | 120)}
                    style={[
                      styles.durationPill,
                      selected && styles.durationPillSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.durationText,
                        selected && styles.durationTextSelected,
                      ]}
                    >
                      {d}min
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <ScrollView horizontal style={styles.timeSlotsContainer}>
              {timeSlots.map((slot) => {
                const selected = selectedTime === slot;

                return (
                  <Pressable
                    key={slot}
                    onPress={() => setSelectedTime(slot)}
                    style={[
                      styles.timeSlot,
                      selected && styles.timeSlotSelected,
                    ]}
                  >
                    <Text style={selected ? { color: "white" } : undefined}>
                      {slot}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.courtsBlock}>
              {(showAvailable
                ? courts.filter((c) => isCourtAvailable(c.id))
                : courts
              ).map((c) => {
                const available = isCourtAvailable(c.id);

                return (
                  <Pressable
                    key={c.id}
                    disabled={!available || bookingBusy}
                    onPress={() => handleBook(c)}
                    style={[
                      styles.courtRow,
                      !available && styles.courtRowDisabled,
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.courtName}>{c.name}</Text>
                      <Text style={styles.courtMeta}>
                        {c.type} · {c.surface}
                      </Text>
                    </View>

                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.courtPrice}>
                        {priceForDuration(c)}
                      </Text>
                      <Text style={styles.courtStatus}>
                        {available ? "Available" : "Taken"}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  padelvenue: {
    width: width,
    height: width * 0.6,
    resizeMode: "cover",
  },

  totalaboveview: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    elevation: 5,
  },

  viewstyle: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  venueInfo: {
    flex: 1,
  },
  venuetitle: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#333",
    marginBottom: 6,
  },
  venueadress: {
    color: "#888",
    fontSize: 14,
  },

  viewstyletwo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 15,
    paddingVertical: 16,
  },
  tabText: {
    color: "#a1a1a1",
    fontSize: 14,
    fontWeight: "500",
  },
  activeTab: {
    color: "black",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },

  selectedCircle: {
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  dayCard: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  circle: {
    backgroundColor: "#fff",
    borderRadius: 50,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 0.5,
  },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 25,
  },

  durationRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 25,
    paddingBottom: 10,
  },
  durationPill: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  durationPillSelected: {
    backgroundColor: "#333",
    borderColor: "#333",
  },
  durationText: {
    fontWeight: "600",
  },
  durationTextSelected: {
    color: "white",
  },

  timeSlotsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  timeSlot: {
    marginRight: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  timeSlotSelected: {
    backgroundColor: "#333",
    borderColor: "#333",
  },

  courtsBlock: {
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  courtRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  courtRowDisabled: {
    opacity: 0.5,
  },
  courtName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0d2432",
  },
  courtMeta: {
    marginTop: 2,
    color: "#6b7280",
    fontSize: 12,
  },
  courtPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#335FFF",
  },
  courtStatus: {
    marginTop: 2,
    fontSize: 12,
    color: "#6b7280",
  },
});
