import { router, useLocalSearchParams } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";

type MatchDoc = {
  id: string;
  locationId?: string;
  courtId?: string | null;
  dateKey?: string;
  startMinute?: number;
  status?: string;
};

type LocationDoc = {
  name?: string;
};

type CourtDoc = {
  name?: string;
};

type BookingDoc = {
  courtId?: string;
  locationId?: string;
  dateKey?: string;
  startMinute?: number;
  status?: "confirmed" | "cancelled";
};

type ChatMessageDoc = {
  text?: string;
  senderId?: string;
  senderName?: string;
  createdAt?: { seconds: number; nanoseconds: number };
};

type ChatMessage = {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  createdAtMs: number;
};

type UserDoc = {
  username?: string;
  displayName?: string;
};

const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n));

const minutesToHHMM = (totalMinutes?: number) => {
  if (!Number.isFinite(totalMinutes)) return "--:--";
  const safe = Number(totalMinutes);
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${pad2(h)}:${pad2(m)}`;
};

const formatDateLabel = (dateKey?: string) => {
  if (!dateKey) return "Unknown date";
  const [year, month, day] = dateKey.split("-").map((v) => Number(v));
  if (!year || !month || !day) return "Unknown date";

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  const today = new Date();
  const isToday =
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate();

  if (isToday) return "Today";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
};

const Index = () => {
  const params = useLocalSearchParams<{ chatId?: string | string[] }>();
  const chatId =
    typeof params.chatId === "string"
      ? params.chatId
      : Array.isArray(params.chatId)
        ? params.chatId[0]
        : undefined;

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [courtTitle, setCourtTitle] = useState("Match court");
  const [dateSubtitle, setDateSubtitle] = useState("Unknown date");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentUserName, setCurrentUserName] = useState("Player");

  const listRef = useRef<FlatList<ChatMessage>>(null);
  const currentUserId = auth.currentUser?.uid ?? "anonymous";

  useEffect(() => {
    const loadCurrentUserName = async () => {
      const authUser = auth.currentUser;
      if (!authUser) {
        setCurrentUserName("Player");
        return;
      }

      try {
        const userSnap = await getDoc(doc(db, "users", authUser.uid));
        const user = userSnap.exists() ? (userSnap.data() as UserDoc) : null;

        setCurrentUserName(user?.username ?? authUser.displayName ?? "Player");
      } catch {
        setCurrentUserName(authUser.displayName ?? "Player");
      }
    };

    loadCurrentUserName().catch(() => {
      setCurrentUserName(auth.currentUser?.displayName ?? "Player");
    });
  }, []);

  const loadMatchMeta = useCallback(async () => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const matchSnap = await getDoc(doc(db, "matches", chatId));
      if (!matchSnap.exists()) {
        setCourtTitle("Match not found");
        setDateSubtitle("Unknown date");
        return;
      }

      const match: MatchDoc = {
        id: matchSnap.id,
        ...(matchSnap.data() as Omit<MatchDoc, "id">),
      };

      let resolvedCourtId: string | null = match.courtId ?? null;

      if (
        !resolvedCourtId &&
        match.locationId &&
        match.dateKey &&
        Number.isFinite(match.startMinute)
      ) {
        const bookingSnap = await getDocs(
          query(
            collection(db, "bookings"),
            where("locationId", "==", match.locationId),
            where("dateKey", "==", match.dateKey),
            where("startMinute", "==", match.startMinute),
            where("status", "==", "confirmed"),
          ),
        );

        const booking = bookingSnap.docs[0]?.data() as BookingDoc | undefined;
        resolvedCourtId = booking?.courtId ?? null;
      }

      const [locationSnap, courtSnap] = await Promise.all([
        match.locationId
          ? getDoc(doc(db, "locations", match.locationId))
          : Promise.resolve(null),
        resolvedCourtId
          ? getDoc(doc(db, "courts", resolvedCourtId))
          : Promise.resolve(null),
      ]);

      const location =
        locationSnap && locationSnap.exists()
          ? (locationSnap.data() as LocationDoc)
          : null;
      const court =
        courtSnap && courtSnap.exists() ? (courtSnap.data() as CourtDoc) : null;

      setCourtTitle(court?.name ?? location?.name ?? "Match court");
      setDateSubtitle(
        `${formatDateLabel(match.dateKey)} · ${minutesToHHMM(match.startMinute)}`,
      );
    } catch (e) {
      console.error(e);
      setCourtTitle("Match chat");
      setDateSubtitle("Could not load details");
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    loadMatchMeta().catch((e) => console.error(e));
  }, [loadMatchMeta]);

  useEffect(() => {
    if (!chatId) return;

    const messagesQuery = query(
      collection(db, "matches", chatId, "messages"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const mapped = snapshot.docs.map((messageSnap) => {
          const raw = messageSnap.data() as ChatMessageDoc;
          return {
            id: messageSnap.id,
            text: raw.text ?? "",
            senderId: raw.senderId ?? "unknown",
            senderName:
              raw.senderId !== currentUserId && raw.senderName === "You"
                ? "Player"
                : (raw.senderName ?? "Player"),
            createdAtMs: raw.createdAt
              ? raw.createdAt.seconds * 1000
              : Number.MAX_SAFE_INTEGER,
          } as ChatMessage;
        });

        setMessages(mapped);

        requestAnimationFrame(() => {
          listRef.current?.scrollToEnd({ animated: true });
        });
      },
      (e) => {
        console.error(e);
      },
    );

    return () => unsubscribe();
  }, [chatId]);

  const isInputEmpty = useMemo(() => input.trim().length === 0, [input]);

  const sendMessage = async () => {
    if (!chatId || isInputEmpty || sending) return;

    if (!auth.currentUser) {
      Alert.alert("Sign in required", "Please sign in to send messages.");
      return;
    }

    const text = input.trim();

    try {
      setSending(true);
      await addDoc(collection(db, "matches", chatId, "messages"), {
        text,
        senderId: currentUserId,
        senderName: currentUserName,
        createdAt: serverTimestamp(),
      });
      setInput("");
    } catch (e) {
      console.error(e);
      Alert.alert("Message failed", "Could not send your message.");
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const mine = item.senderId === currentUserId;

    return (
      <View
        style={[
          styles.messageRow,
          mine ? styles.messageRowMine : styles.messageRowOther,
        ]}
      >
        <View
          style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}
        >
          {!mine ? (
            <Text style={styles.senderName}>{item.senderName}</Text>
          ) : null}
          <Text
            style={[
              styles.messageText,
              mine ? styles.messageTextMine : styles.messageTextOther,
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Image
              source={require("@/assets/images/bookCourt/back.png")}
              style={styles.headerIconLeft}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>Match chat</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity activeOpacity={0.7}>
            <Image
              source={require("@/assets/images/chat/three_dots.png")}
              style={styles.headerIconRight}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.matchInfoHeader}>
        <View style={styles.matchInfoLeft}>
          <Text style={styles.placeTitle}>{courtTitle}</Text>
          <Text style={styles.placeDate}>{dateSubtitle}</Text>
        </View>
        <View style={styles.matchInfoRight}>
          <Text style={styles.detail}>Details</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#335FFF" />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatListContent}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No messages yet. Say hi to the match!
            </Text>
          }
          onContentSizeChange={() => {
            listRef.current?.scrollToEnd({ animated: true });
          }}
        />
      )}

      <View style={styles.typeBox}>
        <TouchableOpacity style={styles.leftTextIcon} activeOpacity={0.7}>
          <Image
            source={require("@/assets/images/chat/plus.png")}
            style={styles.leftTextIcon}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="Write a message"
          placeholderTextColor="#9ca3af"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />

        <TouchableOpacity
          style={[
            styles.sendTouch,
            (isInputEmpty || sending) && styles.sendTouchDisabled,
          ]}
          activeOpacity={0.7}
          onPress={sendMessage}
          disabled={isInputEmpty || sending}
        >
          <Image
            source={require("@/assets/images/chat/send.png")}
            style={styles.rightTextIcon}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 14,
  },
  headerContainer: {
    flexDirection: "row",
    paddingHorizontal: 18,
    paddingTop: 40,
    paddingBottom: 14,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    borderBottomColor: "#d9dde3",
    borderBottomWidth: 1,
  },
  headerLeft: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerRight: {
    flex: 1,
    paddingRight: 4,
    alignItems: "flex-end",
  },
  headerIconLeft: {
    height: 32,
    width: 32,
  },
  headerIconRight: {
    height: 18,
    width: 18,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },

  matchInfoHeader: {
    flexDirection: "row",
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomColor: "#d9dde3",
    borderBottomWidth: 1,
  },
  matchInfoLeft: {
    flex: 3,
  },
  placeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgb(52, 53, 55)",
  },
  placeDate: {
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
  },
  matchInfoRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  detail: {
    fontSize: 16,
    color: "#335FFF",
    fontWeight: "600",
  },

  chatContainer: {
    flex: 1,
  },
  chatListContent: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 6,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#7a8592",
    fontSize: 13,
    textAlign: "center",
    marginTop: 16,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  messageRowMine: {
    justifyContent: "flex-end",
  },
  messageRowOther: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "78%",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  bubbleMine: {
    backgroundColor: "#2f7bff",
    borderBottomRightRadius: 6,
  },
  bubbleOther: {
    backgroundColor: "#f1f3f6",
    borderBottomLeftRadius: 6,
  },
  senderName: {
    fontSize: 10,
    color: "#4f5d6f",
    fontWeight: "600",
    marginBottom: 3,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextMine: {
    color: "#fff",
  },
  messageTextOther: {
    color: "#1b2430",
  },

  typeBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderTopColor: "#d9dde3",
    borderTopWidth: 1,
    backgroundColor: "#fff",
  },
  leftTextIcon: {
    justifyContent: "center",
    alignItems: "center",
    width: 20,
    height: 20,
    tintColor: "#335FFF",
  },
  rightTextIcon: {
    width: 18,
    height: 18,
    tintColor: "#335FFF",
    resizeMode: "contain",
  },
  sendTouch: {
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  sendTouchDisabled: {
    opacity: 0.35,
  },
  chatIcon: {
    resizeMode: "contain",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingHorizontal: 24,
    height: 40,
  },
});

export default Index;
