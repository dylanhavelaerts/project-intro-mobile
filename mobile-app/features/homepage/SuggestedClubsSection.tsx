/**
 * Component for displaying a horizontal scrollable section of suggested clubs on the homepage.
 * - Receives a list of suggested clubs and loading state as props
 * - Displays a header with section title and "See all" link
 */

import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { SuggestedClub } from "./types";

type SuggestedClubsSectionProps = {
  clubs: SuggestedClub[];
  loading: boolean;
};

const ClubCard = ({ club }: { club: SuggestedClub }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/(noHeaders)/makeMatch/${club.id}` as any)}
    >
      <ImageBackground
        source={club.imageUrl ? { uri: club.imageUrl } : undefined}
        style={styles.image}
        imageStyle={styles.imageRadius}
      >
        <View style={styles.overlay}>
          <Text style={styles.clubName} numberOfLines={1}>
            {club.name}
          </Text>
          <Text style={styles.clubMeta}>
            {club.distanceKm}km - {club.city}
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.statsRow}>
        <View style={styles.statCell}>
          <Text style={styles.statLabel}>Open Matches</Text>
          <Text style={styles.statValue}>{club.openMatches}</Text>
        </View>
        <View style={styles.statCell}>
          <Text style={styles.statLabel}>Tournaments</Text>
          <Text style={styles.statValue}>{club.tournaments}</Text>
        </View>
        <View style={styles.statCellNoBorder}>
          <Text style={styles.statLabel}>Classes</Text>
          <Text style={styles.statValue}>{club.classes}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const SuggestedClubsSection = ({ clubs, loading }: SuggestedClubsSectionProps) => {
  return (
    <View style={styles.section}>
      <View style={styles.rowHeader}>
        <Text style={styles.sectionTitle}>Suggested clubs for you</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color="#335FFF" />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 0,
  },
  rowHeader: {
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#0f2437",
    fontWeight: "700",
    fontFamily: "System",
  },
  seeAll: {
    color: "#335FFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "System",
  },
  loadingWrap: {
    paddingVertical: 12,
    alignItems: "center",
  },
  scrollContent: {
    paddingLeft: 15,
    paddingRight: 18,
    gap: 12,
  },
  card: {
    width: 338,
    borderWidth: 1,
    borderColor: "#d0d5dc",
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    overflow: "hidden",
  },
  image: {
    height: 136,
    justifyContent: "flex-end",
    backgroundColor: "#8aa1b7",
  },
  imageRadius: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  overlay: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: "rgba(8, 22, 35, 0.42)",
  },
  clubName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "System",
  },
  clubMeta: {
    marginTop: 4,
    color: "#f1f5f9",
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "System",
  },
  statsRow: {
    flexDirection: "row",
    minHeight: 78,
    backgroundColor: "#f3f4f6",
  },
  statCell: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    borderRightWidth: 1,
    borderRightColor: "#dfe3e9",
  },
  statCellNoBorder: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
  },
  statLabel: {
    fontSize: 12,
    color: "#1f2b37",
    fontFamily: "System",
    fontWeight: "500",
  },
  statValue: {
    marginTop: 8,
    fontSize: 15,
    color: "#101d2a",
    fontWeight: "700",
    fontFamily: "System",
  },
});
