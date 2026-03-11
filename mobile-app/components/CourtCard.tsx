import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";

export type CourtData = {
  id: string;
  name: string;
  image: any;
  price: string;
  duration: string;
  distance: string;
  location: string;
  timeSlots: string[];
  isFavorite?: boolean;
};

const CourtCard = ({
  court,
  onToggleFavorite,
}: {
  court: CourtData;
  onToggleFavorite?: (id: string) => void;
}) => {
  return (
    <View style={styles.cardWrapper}>
      <ImageBackground
        source={court.image}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite?.(court.id)}
        >
          <Text style={styles.favoriteIcon}>
            {court.isFavorite ? "♥" : "♡"}
          </Text>
        </TouchableOpacity>

        <View style={styles.imageOverlay}>
          <View style={styles.overlayRow}>
            <Text style={styles.courtName} numberOfLines={1}>
              {court.name}
            </Text>
            <View style={styles.priceBlock}>
              <Text style={styles.durationLabel}>{court.duration} from</Text>
              <Text style={styles.priceText}>{court.price}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.infoSection}>
        <Text style={styles.distanceText}>
          {court.distance} - {court.location}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timeSlotsContainer}
        >
          {court.timeSlots.map((slot, index) => (
            <TouchableOpacity key={index} style={styles.timeSlot}>
              <Text style={styles.timeSlotText}>{slot}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 20,
  },

  // IMAGE
  imageBackground: {
    height: 280,
    justifyContent: "flex-end",
    width: "100%",
  },
  imageStyle: {
    borderRadius: 0,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIcon: {
    fontSize: 20,
    color: "#fff",
  },
  imageOverlay: {
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  overlayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  courtName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
    marginRight: 10,
  },
  priceBlock: {
    alignItems: "flex-end",
  },
  durationLabel: {
    fontSize: 12,
    color: "#ccc",
  },
  priceText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  // INFO BELOW IMAGE
  infoSection: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  distanceText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  timeSlotsContainer: {
    gap: 8,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0d2432",
  },
});

export default CourtCard;
