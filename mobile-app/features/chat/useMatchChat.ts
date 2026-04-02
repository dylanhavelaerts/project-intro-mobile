/**
 * This file contains the `useMatchChat` custom hook, which encapsulates all state and logic related to the Match Chat feature, including:
 * - Managing the chat input state
 * - Fetching and subscribing to chat messages for a given match chat
 * - Fetching and structuring match metadata for display in the chat header
 * - Handling the sending of new chat messages
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { auth } from "@/config/firebaseConfig";
import {
  createMatchMessage,
  fetchCurrentUserName,
  fetchMatchChatMeta,
  subscribeToMatchMessages,
} from "./chatService";
import { ChatMessage } from "./types";

type UseMatchChatResult = {
  loading: boolean;
  sending: boolean;
  input: string;
  setInput: (value: string) => void;
  messages: ChatMessage[];
  currentUserId: string;
  courtTitle: string;
  dateSubtitle: string;
  locationDetailsId: string | null;
  isInputEmpty: boolean;
  sendMessage: () => Promise<"ok" | "unauthenticated" | "error">;
};

export const useMatchChat = (chatId?: string): UseMatchChatResult => {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [courtTitle, setCourtTitle] = useState("Match court");
  const [dateSubtitle, setDateSubtitle] = useState("Unknown date");
  const [locationDetailsId, setLocationDetailsId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentUserName, setCurrentUserName] = useState("Player");

  const currentUserId = auth.currentUser?.uid ?? "anonymous";

  useEffect(() => {
    const loadCurrentUserName = async () => {
      const authUser = auth.currentUser;
      if (!authUser) {
        setCurrentUserName("Player");
        return;
      }

      try {
        const resolved = await fetchCurrentUserName(
          authUser.uid,
          authUser.displayName ?? "Player",
        );
        setCurrentUserName(resolved);
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
      const meta = await fetchMatchChatMeta(chatId);
      setCourtTitle(meta.courtTitle);
      setDateSubtitle(meta.dateSubtitle);
      setLocationDetailsId(meta.locationDetailsId);
    } catch (error) {
      console.error(error);
      setCourtTitle("Match chat");
      setDateSubtitle("Could not load details");
      setLocationDetailsId(null);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    loadMatchMeta().catch((error) => console.error(error));
  }, [loadMatchMeta]);

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = subscribeToMatchMessages(
      chatId,
      currentUserId,
      setMessages,
      (error) => console.error(error),
    );

    return () => unsubscribe();
  }, [chatId, currentUserId]);

  const isInputEmpty = useMemo(() => input.trim().length === 0, [input]);

  const sendMessage = useCallback(async () => {
    if (!chatId || isInputEmpty || sending) return "error";

    if (!auth.currentUser) {
      return "unauthenticated";
    }

    const text = input.trim();

    try {
      setSending(true);
      await createMatchMessage(chatId, text, currentUserId, currentUserName);
      setInput("");
      return "ok";
    } catch (error) {
      console.error(error);
      return "error";
    } finally {
      setSending(false);
    }
  }, [chatId, currentUserId, currentUserName, input, isInputEmpty, sending]);

  return {
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
  };
};
