import { router } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export type MatchData = {
  id: string;
  date: string;
  time: string;
  type: string;
  levelRange: string;
  players: (PlayerData | null)[];
  court: string;
  distance: string;
  location: string;
  price: string;
  duration: string;
};

type PlayerData = { name: string; rating: string; avatar: string | null };

const PlayerSlot = ({ player }: { player: PlayerData | null }) => {
  if (player) {
    return (
      <View style={styles.playerSlot}>
        <View style={[styles.avatarCircle, styles.avatarFilled]}>
          <Text style={styles.avatarPlaceholderText}>
            {player.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.playerName} numberOfLines={1}>
          {player.name}
        </Text>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{player.rating}</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.playerSlot}>
      <View style={styles.avatarCircle}>
        <Text style={styles.plusIcon}>+</Text>
      </View>
      <Text style={styles.availableText}>Available</Text>
    </View>
  );
};

const MatchCard = ({ match }: { match: MatchData }) => {
  const leftTeam = [match.players[0], match.players[1]];
  const rightTeam = [match.players[2], match.players[3]];

  return (
    <TouchableOpacity
      style={styles.matchCard}
      activeOpacity={0.7}
      onPress={() => router.push("/(noHeaders)/makeMatch" as any)}
    >
      {/* Date & Time */}
      <Text style={styles.matchDateTime}>
        {match.date} | {match.time}
      </Text>

      {/* Match info row */}
      <View style={styles.matchInfoRow}>
        <View style={styles.matchTypeRow}>
          <Text style={styles.matchTypeIcon}></Text>
          <Text style={styles.matchTypeText}>{match.type}</Text>
        </View>
        <View style={styles.matchLevelRow}>
          <Text style={styles.levelIcon}></Text>
          <Text style={styles.levelText}>{match.levelRange}</Text>
        </View>
      </View>

      {/* Players */}
      <View style={styles.playersContainer}>
        <View style={styles.teamSide}>
          {leftTeam.map((p, i) => (
            <PlayerSlot key={`left-${i}`} player={p} />
          ))}
        </View>
        <View style={styles.teamDivider} />
        <View style={styles.teamSide}>
          {rightTeam.map((p, i) => (
            <PlayerSlot key={`right-${i}`} player={p} />
          ))}
        </View>
      </View>

      {/* Court info */}
      <View style={styles.courtInfoDivider} />
      <View style={styles.courtInfoRow}>
        <View style={styles.courtInfoLeft}>
          <Text style={styles.courtIcon}></Text>
          <View>
            <Text style={styles.courtName}>{match.court}</Text>
            <Text style={styles.courtDistance}>
              {match.distance} · {match.location}
            </Text>
          </View>
        </View>
        <View style={styles.courtInfoRight}>
          <Text style={styles.priceText}>{match.price}</Text>
          <Text style={styles.durationText}>{match.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // MATCH CARD
  matchCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#d4a843",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  matchDateTime: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0d2432",
    marginBottom: 6,
  },
  matchInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 14,
  },
  matchTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  matchTypeIcon: {
    fontSize: 14,
  },
  matchTypeText: {
    fontSize: 14,
    color: "#4B5563",
  },
  matchLevelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  levelIcon: {
    fontSize: 14,
  },
  levelText: {
    fontSize: 14,
    color: "#4B5563",
  },

  // PLAYERS
  playersContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 14,
  },
  teamSide: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-evenly",
  },
  teamDivider: {
    width: 1,
    backgroundColor: "#ddd",
    alignSelf: "stretch",
    marginHorizontal: 6,
  },
  playerSlot: {
    alignItems: "center",
    width: 72,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "#c5cdd5",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 6,
  },
  avatarFilled: {
    backgroundColor: "#335FFF",
    borderColor: "#335FFF",
  },
  avatarPlaceholderText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },
  plusIcon: {
    fontSize: 24,
    color: "#c5cdd5",
    fontWeight: "300",
  },
  playerName: {
    fontSize: 12,
    color: "#0d2432",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 3,
  },
  availableText: {
    fontSize: 12,
    color: "#335FFF",
    fontWeight: "500",
  },
  ratingBadge: {
    backgroundColor: "#C8FC2C",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0d2432",
  },

  // COURT INFO
  courtInfoDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 10,
  },
  courtInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courtInfoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  courtIcon: {
    fontSize: 18,
  },
  courtName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0d2432",
  },
  courtDistance: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 1,
  },
  courtInfoRight: {
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#335FFF",
  },
  durationText: {
    fontSize: 12,
    color: "#335FFF",
  },
});

export default MatchCard;
