import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
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
import { auth } from "@/config/firebaseConfig";
import { DetailHeroHeader } from "@/features/findMatchDetail/DetailHeroHeader";
import {
  formatLevel,
  formatPrice,
  minutesToHHMM,
} from "@/features/findMatchDetail/model/matchDetailFormatters";
import { MatchInformationSection } from "@/features/findMatchDetail/cards/MatchInformationSection";
import { MatchLocationCard } from "@/features/findMatchDetail/cards/MatchLocationCard";
import { MatchMetaCards } from "@/features/findMatchDetail/cards/MatchMetaCards";
import { MatchPlayersCard } from "@/features/findMatchDetail/cards/MatchPlayersCard";
import { MatchSummaryCard } from "@/features/findMatchDetail/cards/MatchSummaryCard";
import { useMatchDetail } from "@/features/findMatchDetail/hooks/useMatchDetail";
import { useMatchParticipation } from "@/features/findMatchDetail/hooks/useMatchParticipation";

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

  const [popup, setPopup] = useState<PopupState>({
    visible: false,
    title: "",
    message: "",
    tone: "success",
  });

  const {
    pendingSlotIndexes,
    renderedPlayerSlots,
    bookingBusy,
    onSlotPress,
    bookSelectedPlaces,
  } = useMatchParticipation({
    match,
    playerSlots,
    refresh,
  });

  const openPopup = (
    title: string,
    message: string,
    tone: PopupState["tone"] = "error",
  ) => {
    setPopup({ visible: true, title, message, tone });
  };

  const handleSlotPress = (slotIndex: number) => {
    const status = onSlotPress(slotIndex);

    if (status === "sign_in_required") {
      openPopup("Sign in required", "Please log in before joining a match.");
      return;
    }

    if (status === "already_joined") {
      openPopup("Already joined", "You already joined this match.");
    }
  };

  const handleBookPlace = async () => {
    const status = await bookSelectedPlaces();

    if (status === "success") {
      openPopup("Payment successful", "You paid.", "success");
      return;
    }

    if (status === "sign_in_required") {
      openPopup("Sign in required", "Please log in before booking a place.");
      return;
    }

    if (status === "already_joined") {
      openPopup("Already joined", "You already joined this match.");
      return;
    }

    if (status === "select_slot") {
      openPopup("Select a slot", "Tap one or more + icons first.");
      return;
    }

    if (status === "match_unavailable") {
      openPopup("Match unavailable", "This match is no longer available.");
      return;
    }

    if (status === "match_full") {
      openPopup(
        "Match full",
        "This match is full. Your selected slots are no longer available.",
      );
      return;
    }

    if (status === "payment_failed") {
      openPopup("Payment failed", "Could not book your place right now.");
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

  const isMatchParticipant =
    currentUserId != null && (match.players ?? []).includes(currentUserId);

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
        {/* Submit Result — only visible to participants when match is full */}
        {match.status === "full" && isMatchParticipant && (
          <View style={styles.simulateWrap}>
            <TouchableOpacity
              style={styles.simulateButton}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: "/(noHeaders)/makeMatch/submitResult",
                  params: {
                    matchId: match.id,
                    teamAIds: JSON.stringify([
                      match.players?.[0] ?? "",
                      match.players?.[1] ?? "",
                    ]),
                    teamANames: JSON.stringify([
                      playerSlots[0]?.name ?? "Player A1",
                      playerSlots[1]?.name ?? "Player A2",
                    ]),
                    teamBIds: JSON.stringify([
                      match.players?.[2] ?? "",
                      match.players?.[3] ?? "",
                    ]),
                    teamBNames: JSON.stringify([
                      playerSlots[2]?.name ?? "Player B1",
                      playerSlots[3]?.name ?? "Player B2",
                    ]),
                    competitive: String(match.competitive ?? false),
                  },
                } as any)
              }
            >
              <Text style={styles.simulateText}>▶ Submit Result</Text>
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

        <MatchLocationCard
          location={location}
          onPressMoreInfo={() => {
            if (!match.locationId) return;
            router.push(`/(noHeaders)/makeMatch/${match.locationId}` as any);
          }}
        />
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
