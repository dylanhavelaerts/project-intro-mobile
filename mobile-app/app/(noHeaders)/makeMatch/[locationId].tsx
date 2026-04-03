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
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { auth } from "@/config/firebaseConfig";
import { useVenueMakeMatch } from "@/features/makeMatch/hooks/useVenueMakeMatch";
import { minutesToHHMM, toDateKeyLocal } from "@/features/makeMatch/utils/dateTime";

const { width } = Dimensions.get("window");

export default function VenueMakeMatch() {
  const params = useLocalSearchParams<{ locationId?: string | string[] }>();
  const locationId =
    typeof params.locationId === "string"
      ? params.locationId
      : Array.isArray(params.locationId)
        ? params.locationId[0]
        : undefined;
  const router = useRouter();

  const {
    activeTab,
    setActiveTab,
    showAvailable,
    setShowAvailable,
    durationMinutes,
    setDurationMinutes,
    setSelectedDate,
    timeSlots,
    selectedTime,
    setSelectedTime,
    matches,
    matchesLoading,
    showCreateMatch,
    setShowCreateMatch,
    levelMin,
    setLevelMin,
    levelMax,
    setLevelMax,
    mixed,
    setMixed,
    competitive,
    setCompetitive,
    location,
    courts,
    loading,
    bookingBusy,
    dateKey,
    days,
    isFavorite,
    favoriteBusy,
    isCourtAvailable,
    priceForDuration,
    toggleVenueFavorite,
    handleBook,
    handleCreateMatch,
    handleJoinMatch,
  } = useVenueMakeMatch(locationId);

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

          <Pressable
            onPress={toggleVenueFavorite}
            disabled={favoriteBusy}
            hitSlop={8}
          >
            <Image
              source={
                isFavorite
                  ? require("@/assets/images/bookCourt/heart-black.png")
                  : require("@/assets/images/bookCourt/heart.png")
              }
              style={styles.venueHeartIcon}
            />
          </Pressable>
        </View>

        <View style={styles.viewstyletwo}>
          <Pressable
            onPress={() => {
              setActiveTab("Home");
            }}
          >
            <Text
              style={activeTab === "Home" ? styles.activeTab : styles.tabText}
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
              style={activeTab === "Book" ? styles.activeTab : styles.tabText}
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
                activeTab === "Open Matches" ? styles.activeTab : styles.tabText
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
                activeTab === "Competitions" ? styles.activeTab : styles.tabText
              }
            >
              Competitions
            </Text>
          </Pressable>
        </View>

        {activeTab === "Book" && (
          <View style={{ backgroundColor: "#f5f5f5" }}>
            <ScrollView horizontal style={{ padding: 10 }}>
              {days.map((item) => (
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
        {activeTab === "Open Matches" && (
          <View style={{ backgroundColor: "#f5f5f5" }}>
            {/* Reuse same day + toggle + duration + times UI if you want.
        MVP: reuse the same selectedDate/selectedTime/durationMinutes state. */}

            <ScrollView horizontal style={{ padding: 10 }}>
              {days.map((item) => (
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
              <Text>Show available matches only</Text>
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
              <Pressable
                onPress={() => setShowCreateMatch(!showCreateMatch)}
                style={[styles.courtRow, { justifyContent: "center" }]}
              >
                <Text style={{ fontWeight: "700", color: "#0d2432" }}>
                  {showCreateMatch ? "Close" : "+ Create match"}
                </Text>
              </Pressable>

              {showCreateMatch && (
                <View
                  style={[
                    styles.courtRow,
                    { flexDirection: "column", gap: 10 },
                  ]}
                >
                  <Text style={{ fontWeight: "700" }}>Match settings</Text>

                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text>Level min</Text>
                      <TextInput
                        value={levelMin}
                        onChangeText={setLevelMin}
                        keyboardType="decimal-pad"
                        style={{
                          borderWidth: 1,
                          borderColor: "#ddd",
                          borderRadius: 8,
                          padding: 10,
                        }}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text>Level max</Text>
                      <TextInput
                        value={levelMax}
                        onChangeText={setLevelMax}
                        keyboardType="decimal-pad"
                        style={{
                          borderWidth: 1,
                          borderColor: "#ddd",
                          borderRadius: 8,
                          padding: 10,
                        }}
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text>Mixed</Text>
                    <Switch value={mixed} onValueChange={setMixed} />
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text>Competitive</Text>
                    <Switch
                      value={competitive}
                      onValueChange={setCompetitive}
                    />
                  </View>

                  <Pressable
                    disabled={bookingBusy}
                    onPress={handleCreateMatch}
                    style={[
                      styles.timeSlot,
                      {
                        alignSelf: "stretch",
                        marginRight: 0,
                        backgroundColor: "#0d2432",
                        borderColor: "#0d2432",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontWeight: "700",
                      }}
                    >
                      Create match
                    </Text>
                  </Pressable>
                </View>
              )}

              {matchesLoading ? (
                <View style={{ padding: 16 }}>
                  <ActivityIndicator />
                </View>
              ) : (
                (showAvailable
                  ? matches.filter(
                      (m) => (m.players?.filter(Boolean).length ?? 0) < 4,
                    )
                  : matches
                ).map((m) => (
                  <View key={m.id} style={styles.courtRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.courtName}>
                        {minutesToHHMM(m.startMinute)} · Level {m.levelMin} -{" "}
                        {m.levelMax}
                      </Text>
                      <Text style={styles.courtMeta}>
                        Players: {m.players?.filter(Boolean).length ?? 0}/4 ·{" "}
                        {m.mixed ? "Mixed" : "Not mixed"} ·{" "}
                        {m.competitive ? "Competitive" : "Friendly"}
                      </Text>
                      {m.players?.includes(auth.currentUser?.uid ?? "") ? (
                        // User is in this match → show Submit Result
                        <Pressable
                          onPress={() =>
                            router.push({
                              pathname: "/(noHeaders)/makeMatch/submitResult",
                              params: {
                                locationId: locationId,
                                matchId: m.id,
                                teamAIds: JSON.stringify([
                                  m.players?.[0] ?? "",
                                  m.players?.[1] ?? "",
                                ]),
                                teamANames: JSON.stringify([
                                  m.playerNames?.[0] ?? "Player A1",
                                  m.playerNames?.[1] ?? "Player A2",
                                ]),
                                teamBIds: JSON.stringify([
                                  m.players?.[2] ?? "",
                                  m.players?.[3] ?? "",
                                ]),
                                teamBNames: JSON.stringify([
                                  m.playerNames?.[2] ?? "Player B1",
                                  m.playerNames?.[3] ?? "Player B2",
                                ]),
                                competitive: String(m.competitive), // ← add this
                              },
                            })
                          }
                          style={styles.submitBtn}
                        >
                          <Text style={styles.submitBtnText}>
                            Submit Result
                          </Text>
                        </Pressable>
                      ) : (
                        // User is not in this match → show Join
                        <Pressable
                          disabled={
                            bookingBusy || (m.players?.length ?? 0) >= 4
                          }
                          onPress={() => handleJoinMatch(m.id)}
                          style={[
                            styles.submitBtn,
                            { backgroundColor: "#16a34a" },
                            (m.players?.length ?? 0) >= 4 && {
                              backgroundColor: "#9ca3af",
                            },
                          ]}
                        >
                          <Text style={styles.submitBtnText}>
                            {(m.players?.length ?? 0) >= 4 ? "Full" : "Join"}
                          </Text>
                        </Pressable>
                      )}
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.courtPrice}>
                        € {Number(m.pricePerPlayer).toFixed(2)}
                      </Text>
                      <Text style={styles.courtStatus}>Open</Text>
                    </View>
                  </View>
                ))
              )}
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
  venueHeartIcon: {
    width: 20,
    height: 20,
    tintColor: "#111",
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
  submitBtn: {
    marginTop: 8,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});
