import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
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
import { useMatchChat } from "@/features/chat/useMatchChat";
import { ChatMessage } from "@/features/chat/types";

const Index = () => {
  const params = useLocalSearchParams<{ chatId?: string | string[] }>();
  const chatId =
    typeof params.chatId === "string"
      ? params.chatId
      : Array.isArray(params.chatId)
        ? params.chatId[0]
        : undefined;

  const {
    loading,
    sending,
    input,
    setInput,
    messages,
    currentUserId,
    courtTitle,
    dateSubtitle,
    locationDetailsId,
    isInputEmpty,
    sendMessage,
  } = useMatchChat(chatId);

  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages]);

  const handleSendMessage = async () => {
    const result = await sendMessage();

    if (result === "unauthenticated") {
      Alert.alert("Sign in required", "Please sign in to send messages.");
      return;
    }

    if (result === "error") {
      Alert.alert("Message failed", "Could not send your message.");
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
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (!locationDetailsId) return;
              router.push(`/(noHeaders)/makeMatch/${locationDetailsId}` as any);
            }}
            disabled={!locationDetailsId}
          >
            <Text style={styles.detail}>Details</Text>
          </TouchableOpacity>
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
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
        />

        <TouchableOpacity
          style={[
            styles.sendTouch,
            (isInputEmpty || sending) && styles.sendTouchDisabled,
          ]}
          activeOpacity={0.7}
          onPress={handleSendMessage}
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
