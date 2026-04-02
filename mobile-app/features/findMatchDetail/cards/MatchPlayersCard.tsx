import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { PlayerView } from "../model/types";

// ------------------------------------------------------------
// SUBCOMPONENT
// ------------------------------------------------------------
type PlayerSlotProps = {
  player: PlayerView | null;
  pending?: boolean;
  onPress?: () => void;
};

const PlayerSlot = ({ player, pending = false, onPress }: PlayerSlotProps) => {
  if (!player) {
    const emptyContent = (
      <>
        <View
          style={[styles.emptyAvatar, pending && styles.pendingEmptyAvatar]}
        >
          <Text style={styles.plusText}>+</Text>
        </View>
        <Text style={[styles.joinText, pending && styles.pendingJoinText]}>
          Join
        </Text>
      </>
    );

    if (!onPress) {
      return <View style={styles.playerSlot}>{emptyContent}</View>;
    }

    return (
      <Pressable
        style={styles.playerSlot}
        onPress={onPress}
        hitSlop={8}
        android_ripple={{ color: "#dbe3ff", borderless: true }}
      >
        {emptyContent}
      </Pressable>
    );
  }

  const filledContent = (
    <>
      {player.avatar ? (
        <Image
          source={{ uri: player.avatar }}
          style={[styles.avatarImage, pending && styles.pendingAvatarImage]}
        />
      ) : (
        <View
          style={[
            styles.avatarFallback,
            pending && styles.pendingAvatarFallback,
          ]}
        >
          <Text style={styles.avatarFallbackText}>
            {player.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <Text numberOfLines={1} style={styles.playerName}>
        {player.name}
      </Text>
      <View style={styles.playerLevelBadge}>
        <Text style={styles.playerLevelText}>{player.level}</Text>
      </View>
      {pending ? <Text style={styles.pendingLabel}>Pending</Text> : null}
    </>
  );

  if (!onPress) {
    return <View style={styles.playerSlot}>{filledContent}</View>;
  }

  return (
    <Pressable
      style={styles.playerSlot}
      onPress={onPress}
      hitSlop={8}
      android_ripple={{ color: "#dbe3ff", borderless: true }}
    >
      {filledContent}
    </Pressable>
  );
};

// ------------------------------------------------------------
// PROPS
// ------------------------------------------------------------
type MatchPlayersCardProps = {
  playerSlots: (PlayerView | null)[];
  pendingSlotIndexes?: number[];
  onSlotPress?: (slotIndex: number) => void;
};

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export const MatchPlayersCard = ({
  playerSlots,
  pendingSlotIndexes = [],
  onSlotPress,
}: MatchPlayersCardProps) => {
  const isPending = (slotIndex: number) =>
    pendingSlotIndexes.includes(slotIndex);

  return (
    <View style={styles.playersCard}>
      <Text style={styles.playersTitle}>Players</Text>
      <View style={styles.playersRow}>
        <View style={styles.teamColumn}>
          <PlayerSlot
            player={playerSlots[0]}
            pending={isPending(0)}
            onPress={onSlotPress ? () => onSlotPress(0) : undefined}
          />
          <PlayerSlot
            player={playerSlots[1]}
            pending={isPending(1)}
            onPress={onSlotPress ? () => onSlotPress(1) : undefined}
          />
        </View>
        <View style={styles.playersDivider} />
        <View style={styles.teamColumn}>
          <PlayerSlot
            player={playerSlots[2]}
            pending={isPending(2)}
            onPress={onSlotPress ? () => onSlotPress(2) : undefined}
          />
          <PlayerSlot
            player={playerSlots[3]}
            pending={isPending(3)}
            onPress={onSlotPress ? () => onSlotPress(3) : undefined}
          />
        </View>
      </View>
      <View style={styles.teamLabels}>
        <Text style={styles.teamText}>A</Text>
        <Text style={styles.teamText}>B</Text>
      </View>
    </View>
  );
};

// ------------------------------------------------------------
// STYLES
// ------------------------------------------------------------
const styles = StyleSheet.create({
  playersCard: {
    marginTop: 14,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d9dde3",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  playersTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#13283a",
    marginBottom: 12,
  },
  playersRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  teamColumn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  playersDivider: {
    width: 1,
    backgroundColor: "#d9dde3",
    marginHorizontal: 8,
  },
  playerSlot: {
    width: 72,
    alignItems: "center",
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  avatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0d2432",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarFallbackText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },
  emptyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#ced5f6",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f8ff",
  },
  pendingEmptyAvatar: {
    borderColor: "#335FFF",
    backgroundColor: "#e8edff",
  },
  plusText: {
    fontSize: 28,
    color: "#4866d7",
    fontWeight: "300",
  },
  joinText: {
    marginTop: 6,
    color: "#4866d7",
    fontSize: 12,
    fontWeight: "500",
  },
  pendingJoinText: {
    color: "#335FFF",
    fontWeight: "700",
  },
  playerName: {
    marginTop: 6,
    color: "#1f2e3c",
    fontSize: 11,
    fontWeight: "500",
    maxWidth: 72,
  },
  playerLevelBadge: {
    marginTop: 4,
    backgroundColor: "#C8FC2C",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  playerLevelText: {
    color: "#13283a",
    fontWeight: "700",
    fontSize: 10,
  },
  pendingLabel: {
    marginTop: 4,
    color: "#335FFF",
    fontSize: 10,
    fontWeight: "700",
  },
  pendingAvatarImage: {
    borderColor: "#335FFF",
  },
  pendingAvatarFallback: {
    backgroundColor: "#335FFF",
  },
  teamLabels: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  teamText: {
    fontSize: 14,
    color: "#5d6d7d",
    fontWeight: "600",
  },
});
