import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import { DetailHeroHeader } from "@/features/findMatchDetail/DetailHeroHeader";
import {
  formatLevel,
  formatPrice,
  minutesToHHMM,
} from "@/features/findMatchDetail/matchDetailFormatters";
import { MatchInformationSection } from "@/features/findMatchDetail/MatchInformationSection";
import { MatchLocationCard } from "@/features/findMatchDetail/MatchLocationCard";
import { MatchMetaCards } from "@/features/findMatchDetail/MatchMetaCards";
import { MatchPlayersCard } from "@/features/findMatchDetail/MatchPlayersCard";
import { MatchSummaryCard } from "@/features/findMatchDetail/MatchSummaryCard";
import {
  MatchDoc,
  PlayerView,
  UserDoc,
} from "@/features/findMatchDetail/types";
import { useMatchDetail } from "@/features/findMatchDetail/useMatchDetail";

type PopupState = {
  visible: boolean;
  title: string;
  message: string;
  tone: "success" | "error";
};

// ------------------------------------------------------------
// SCREEN
// ------------------------------------------------------------
export default function FindMatchDetailPage() {
  // ------------------------------------------------------------
  // ROUTE PARAMS
  // ------------------------------------------------------------
  const params = useLocalSearchParams<{ matchId?: string | string[] }>();
  const matchId =
    typeof params.matchId === "string"
      ? params.matchId
      : Array.isArray(params.matchId)
        ? params.matchId[0]
        : undefined;

  // ------------------------------------------------------------
  // DATA STATE (FROM HOOK)
  // ------------------------------------------------------------
  const {
    loading,
    error,
    match,
    location,
    court,
    playerSlots,
    placesLeft,
    timeLabel,
    refresh,
  } = useMatchDetail(matchId);

  const currentUserId = auth.currentUser?.uid ?? null;

  const [pendingSlotIndexes, setPendingSlotIndexes] = useState<number[]>([]);
  const [bookingBusy, setBookingBusy] = useState(false);
  const [currentUserPreview, setCurrentUserPreview] =
    useState<PlayerView | null>(null);
  const [popup, setPopup] = useState<PopupState>({
    visible: false,
    title: "",
    message: "",
    tone: "success",
  });

  const openPopup = (
    title: string,
    message: string,
    tone: PopupState["tone"] = "error",
  ) => {
    setPopup({ visible: true, title, message, tone });
  };

  useEffect(() => {
    const loadCurrentUserPreview = async () => {
      if (!currentUserId) {
        setCurrentUserPreview(null);
        return;
      }

      const existingPlayer = playerSlots.find(
        (player) => player?.id === currentUserId,
      );
      if (existingPlayer) {
        setCurrentUserPreview(existingPlayer);
        return;
      }

      try {
        const userSnap = await getDoc(doc(db, "users", currentUserId));
        const user = userSnap.exists() ? (userSnap.data() as UserDoc) : null;

        setCurrentUserPreview({
          id: currentUserId,
          name: user?.username ?? "You",
          level: formatLevel(user?.level),
          avatar: user?.profilePhoto ?? null,
        });
      } catch {
        setCurrentUserPreview({
          id: currentUserId,
          name: "You",
          level: "-",
          avatar: null,
        });
      }
    };

    loadCurrentUserPreview().catch(() => {
      setCurrentUserPreview(
        currentUserId
          ? {
              id: currentUserId,
              name: "You",
              level: "-",
              avatar: null,
            }
          : null,
      );
    });
  }, [currentUserId, playerSlots]);

  useEffect(() => {
    setPendingSlotIndexes((current) =>
      current.filter((slot) => !playerSlots[slot]),
    );
  }, [playerSlots]);

  const isAlreadyJoined = useMemo(
    () =>
      Boolean(
        currentUserId &&
        match?.players?.some((playerId) => playerId === currentUserId),
      ),
    [currentUserId, match?.players],
  );

  const renderedPlayerSlots = useMemo(() => {
    const fallbackPreview =
      currentUserId && !currentUserPreview
        ? {
            id: currentUserId,
            name: "You",
            level: "-",
            avatar: null,
          }
        : null;

    return playerSlots.map((slot, index) => {
      if (slot) return slot;
      if (!pendingSlotIndexes.includes(index)) return null;
      return currentUserPreview ?? fallbackPreview;
    });
  }, [currentUserId, currentUserPreview, pendingSlotIndexes, playerSlots]);

  const handleSlotPress = (slotIndex: number) => {
    if (playerSlots[slotIndex]) return;

    if (!currentUserId) {
      openPopup("Sign in required", "Please log in before joining a match.");
      return;
    }

    if (isAlreadyJoined) {
      openPopup("Already joined", "You already joined this match.");
      return;
    }

    setPendingSlotIndexes((current) =>
      current.includes(slotIndex)
        ? current.filter((slot) => slot !== slotIndex)
        : [...current, slotIndex].sort((a, b) => a - b),
    );
  };

  const handleBookPlace = async () => {
    if (!match) return;

    if (!currentUserId) {
      openPopup("Sign in required", "Please log in before booking a place.");
      return;
    }

    if (isAlreadyJoined) {
      openPopup("Already joined", "You already joined this match.");
      return;
    }

    const requestedSlots = Array.from(
      new Set(pendingSlotIndexes.filter((slot) => slot >= 0 && slot < 4)),
    );

    if (requestedSlots.length === 0) {
      openPopup("Select a slot", "Tap one or more + icons first.");
      return;
    }

    setBookingBusy(true);

    try {
      const latestMatchSnap = await getDoc(doc(db, "matches", match.id));
      if (!latestMatchSnap.exists()) {
        openPopup("Match unavailable", "This match is no longer available.");
        await refresh();
        return;
      }

      const latestMatch: MatchDoc = {
        id: latestMatchSnap.id,
        ...(latestMatchSnap.data() as Omit<MatchDoc, "id">),
      };

      const latestSlots = Array.from({ length: 4 }, (_, index) => {
        const value = latestMatch.players?.[index];
        return typeof value === "string" && value.trim().length > 0
          ? value
          : null;
      });

      if (latestSlots.some((playerId) => playerId === currentUserId)) {
        openPopup("Already joined", "You already joined this match.");
        setPendingSlotIndexes([]);
        await refresh();
        return;
      }

      const hasUnavailableSlot = requestedSlots.some(
        (slot) => latestSlots[slot] !== null,
      );
      const hasSpace = latestSlots.some((slot) => slot === null);

      if (hasUnavailableSlot || !hasSpace) {
        openPopup(
          "Match full",
          "This match is full. Your selected slots are no longer available.",
        );
        setPendingSlotIndexes([]);
        await refresh();
        return;
      }

      requestedSlots.forEach((slot) => {
        latestSlots[slot] = currentUserId;
      });

      const nextStatus = latestSlots.every(Boolean) ? "full" : "open";

      // Fetch joining user's name
      const joiningUserSnap = await getDoc(doc(db, "users", currentUserId));
      const joiningUserName = joiningUserSnap.data()?.username ?? "Unknown";

      // Mirror playerNames array to match the players slots
      const latestMatchData = latestMatchSnap.data() as any;
      const currentNames: (string | null)[] = Array.from(
        { length: 4 },
        (_, i) => latestMatchData.playerNames?.[i] ?? null,
      );
      requestedSlots.forEach((slot) => {
        currentNames[slot] = joiningUserName;
      });

      await updateDoc(doc(db, "matches", match.id), {
        players: latestSlots,
        playerNames: currentNames,
        status: nextStatus,
      });
      openPopup("Payment successful", "You paid.", "success");
      setPendingSlotIndexes([]);
      await refresh();
    } catch (e) {
      console.error(e);
      openPopup("Payment failed", "Could not book your place right now.");
    } finally {
      setBookingBusy(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingRoot}>
        <ActivityIndicator size="large" color="#335FFF" />
      </View>
    );
  }

  if (error || !match) {
    return (
      <View style={styles.loadingRoot}>
        <Text style={styles.errorTitle}>
          {error ?? "Something went wrong."}
        </Text>
        <Pressable style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <DetailHeroHeader />

        <MatchSummaryCard
          placesLeft={placesLeft}
          timeLabel={timeLabel}
          mixed={match.mixed}
          levelRange={`${formatLevel(match.levelMin)}-${formatLevel(match.levelMax)}`}
          priceLabel={formatPrice(match.pricePerPlayer)}
        />

        <MatchMetaCards
          courtBooked={Boolean(match.courtId)}
          competitive={match.competitive}
        />

        <MatchPlayersCard
          playerSlots={renderedPlayerSlots}
          pendingSlotIndexes={pendingSlotIndexes}
          onSlotPress={handleSlotPress}
        />
        {/* Simulate Match — only visible to creator when match is full */}
        {match.createdBy === currentUserId && match.status === "full" && (
          <View style={styles.simulateWrap}>
            <TouchableOpacity
              style={styles.simulateButton}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: "/(noHeaders)/makeMatch/submitResult",
                  params: {
                    matchId: match.id,
                    player1Id: match.players?.[0] ?? "",
                    player1Name: playerSlots[0]?.name ?? "Player 1",
                    player2Id: match.players?.[1] ?? "",
                    player2Name: playerSlots[1]?.name ?? "Player 2",
                    competitive: String(match.competitive ?? false),
                  },
                } as any)
              }
            >
              <Text style={styles.simulateText}>▶ Simulate Match</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.chatWrap}>
          <TouchableOpacity
            style={styles.chatButton}
            activeOpacity={0.9}
            onPress={() => {
              if (!match?.id) return;
              router.push(`/(noHeaders)/chat/${match.id}` as any);
            }}
          >
            <>
              <Ionicons name="chatbubble-outline" size={20} color="#fff" />
              <Text style={styles.chatText}>Chat</Text>
            </>
          </TouchableOpacity>
        </View>

        <MatchLocationCard location={location} />
        <MatchInformationSection
          court={court}
          endRegistration={minutesToHHMM(match.startMinute)}
        />
      </ScrollView>

      <TouchableOpacity
        style={[styles.bottomCta, bookingBusy && styles.bottomCtaDisabled]}
        activeOpacity={0.9}
        disabled={bookingBusy}
        onPress={handleBookPlace}
      >
        <Text style={styles.bottomCtaText}>
          {bookingBusy
            ? "Processing..."
            : `Book place - ${formatPrice(match.pricePerPlayer)}`}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={popup.visible}
        animationType="fade"
        onRequestClose={() =>
          setPopup((current) => ({ ...current, visible: false }))
        }
      >
        <View style={styles.popupBackdrop}>
          <View style={styles.popupCard}>
            <Text
              style={[
                styles.popupTitle,
                popup.tone === "success"
                  ? styles.popupTitleSuccess
                  : styles.popupTitleError,
              ]}
            >
              {popup.title}
            </Text>
            <Text style={styles.popupMessage}>{popup.message}</Text>
            <TouchableOpacity
              style={styles.popupButton}
              onPress={() =>
                setPopup((current) => ({ ...current, visible: false }))
              }
            >
              <Text style={styles.popupButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ------------------------------------------------------------
// STYLES
// ------------------------------------------------------------
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f5f7",
  },
  loadingRoot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f5f7",
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 14,
    color: "#0d2432",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#335FFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  content: {
    paddingBottom: 160,
  },
  chatWrap: {
    marginTop: 28,
    alignItems: "center",
    marginBottom: 14,
  },
  chatButton: {
    backgroundColor: "#335FFF",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 22,
    paddingVertical: 7,
    shadowColor: "#335FFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  chatText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  bottomCta: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: "#335FFF",
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#335FFF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomCtaDisabled: {
    opacity: 0.75,
  },
  bottomCtaText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  popupBackdrop: {
    flex: 1,
    backgroundColor: "rgba(13, 36, 50, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  popupCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d9dde3",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  popupTitleSuccess: {
    color: "#335FFF",
  },
  popupTitleError: {
    color: "#0d2432",
  },
  popupMessage: {
    color: "#4B5563",
    fontSize: 14,
    lineHeight: 20,
  },
  popupButton: {
    marginTop: 14,
    alignSelf: "flex-end",
    backgroundColor: "#335FFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  popupButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  simulateWrap: {
    marginTop: 16,
    alignItems: "center",
    marginBottom: 4,
  },
  simulateButton: {
    backgroundColor: "#0d2432",
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  simulateText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
