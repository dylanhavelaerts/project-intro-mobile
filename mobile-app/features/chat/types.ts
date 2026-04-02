export type MatchDoc = {
  id: string;
  locationId?: string;
  courtId?: string | null;
  dateKey?: string;
  startMinute?: number;
  status?: string;
};

export type LocationDoc = {
  name?: string;
};

export type CourtDoc = {
  name?: string;
};

export type BookingDoc = {
  courtId?: string;
  locationId?: string;
  dateKey?: string;
  startMinute?: number;
  status?: "confirmed" | "cancelled";
};

export type ChatMessageDoc = {
  text?: string;
  senderId?: string;
  senderName?: string;
  createdAt?: { seconds: number; nanoseconds: number };
};

export type ChatMessage = {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  createdAtMs: number;
};

export type UserDoc = {
  username?: string;
  displayName?: string;
};

export type MatchChatMeta = {
  courtTitle: string;
  dateSubtitle: string;
  locationDetailsId: string | null;
};
