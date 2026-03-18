import { db } from "@/config/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";

const locationsData = [
  {
    location: {
      name: "Urban Padel Brussels",
      address: "Rue de la Loi 12",
      city: "Brussels",
      imageUrl:
        "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800",
      sport: "padel",
      openingHours: "08:00 - 23:00",
      rating: 4.6,
      reviewCount: 128,
      amenities: ["parking", "showers", "bar"],
    },
    courts: [
      {
        name: "Court 1",
        surface: "artificial_grass",
        type: "indoor",
        pricePerSlot: 18,
        slotDurationMinutes: 90,
      },
      {
        name: "Court 2",
        surface: "artificial_grass",
        type: "indoor",
        pricePerSlot: 18,
        slotDurationMinutes: 90,
      },
      {
        name: "Court 3",
        surface: "hard",
        type: "outdoor",
        pricePerSlot: 14,
        slotDurationMinutes: 90,
      },
    ],
  },
  {
    location: {
      name: "Padel Club Antwerp",
      address: "Meir 50",
      city: "Antwerp",
      imageUrl:
        "https://www.fordingbridge.co.uk/wp-content/uploads/2024/07/padel-sectorhero2-1.jpg",
      sport: "padel",
      openingHours: "09:00 - 22:00",
      rating: 4.2,
      reviewCount: 74,
      amenities: ["parking", "lockers"],
    },
    courts: [
      {
        name: "Court 1",
        surface: "artificial_grass",
        type: "outdoor",
        pricePerSlot: 14,
        slotDurationMinutes: 90,
      },
      {
        name: "Court 2",
        surface: "artificial_grass",
        type: "outdoor",
        pricePerSlot: 14,
        slotDurationMinutes: 90,
      },
    ],
  },
  {
    location: {
      name: "Antwerp Smash Arena",
      address: "Nationalestraat 22",
      city: "Antwerp",
      imageUrl:
        "https://www.lauraluindustry.co.uk/wp-content/uploads/2022/12/3A-3.jpg",

      sport: "padel",
      openingHours: "08:00 - 23:00",
      rating: 4.5,
      reviewCount: 92,
      amenities: ["parking", "showers", "bar"],
    },
    courts: [
      {
        name: "Court 1",
        surface: "hard",
        type: "indoor",
        pricePerSlot: 20,
        slotDurationMinutes: 90,
      },
      {
        name: "Court 2",
        surface: "hard",
        type: "indoor",
        pricePerSlot: 20,
        slotDurationMinutes: 90,
      },
    ],
  },
  {
    location: {
      name: "Antwerp Padel Factory",
      address: "Turnhoutsebaan 5",
      city: "Antwerp",
      imageUrl:
        "https://www.porticosport.com/canopies/section-canopies-01/canopies-section-05.webp",
      sport: "padel",
      openingHours: "07:00 - 22:00",
      rating: 4.0,
      reviewCount: 41,
      amenities: ["parking", "lockers", "shop"],
    },
    courts: [
      {
        name: "Court 1",
        surface: "artificial_grass",
        type: "outdoor",
        pricePerSlot: 13,
        slotDurationMinutes: 90,
      },
      {
        name: "Court 2",
        surface: "clay",
        type: "outdoor",
        pricePerSlot: 11,
        slotDurationMinutes: 90,
      },
    ],
  },
  {
    location: {
      name: "Gent Padel Center",
      address: "Veldstraat 3",
      city: "Ghent",
      imageUrl:
        "https://www.canobbio.com/wp-content/uploads/2021/11/Padel-Multiple-09.jpg",
      sport: "padel",
      openingHours: "07:00 - 22:00",
      rating: 4.8,
      reviewCount: 210,
      amenities: ["parking", "showers", "bar", "shop"],
    },
    courts: [
      {
        name: "Court 1",
        surface: "hard",
        type: "indoor",
        pricePerSlot: 16,
        slotDurationMinutes: 90,
      },
      {
        name: "Court 2",
        surface: "hard",
        type: "indoor",
        pricePerSlot: 16,
        slotDurationMinutes: 90,
      },
      {
        name: "Court 3",
        surface: "artificial_grass",
        type: "indoor",
        pricePerSlot: 18,
        slotDurationMinutes: 90,
      },
    ],
  },
  {
    location: {
      name: "Ghent Padel Club",
      address: "Korenmarkt 8",
      city: "Ghent",
      imageUrl:
        "https://en-tout-cas.co.uk/images/1920/18370234/HoltPadel11-uRVEudNZJ62TDBQQo0MiDw.jpg",
      sport: "padel",
      openingHours: "09:00 - 22:00",
      rating: 4.3,
      reviewCount: 87,
      amenities: ["parking", "showers", "lockers"],
    },
    courts: [
      {
        name: "Court 1",
        surface: "clay",
        type: "outdoor",
        pricePerSlot: 12,
        slotDurationMinutes: 90,
      },
      {
        name: "Court 2",
        surface: "clay",
        type: "outdoor",
        pricePerSlot: 12,
        slotDurationMinutes: 90,
      },
    ],
  },
  {
    location: {
      name: "Ghent Indoor Padel",
      address: "Sint-Pietersnieuwstraat 15",
      city: "Ghent",
      imageUrl:
        "https://www.integralspor.com/uploads/sports-facilities/full-cover-padel-court-1-1.webp",
      sport: "padel",
      openingHours: "08:00 - 23:00",
      rating: 4.6,
      reviewCount: 134,
      amenities: ["parking", "showers", "bar", "shop"],
    },
    courts: [
      {
        name: "Court 1",
        surface: "artificial_grass",
        type: "indoor",
        pricePerSlot: 19,
        slotDurationMinutes: 90,
      },
      {
        name: "Court 2",
        surface: "artificial_grass",
        type: "indoor",
        pricePerSlot: 19,
        slotDurationMinutes: 90,
      },
    ],
  },
  {
    location: {
      name: "Leuven Padel Arena",
      address: "Bondgenotenlaan 10",
      city: "Leuven",
      imageUrl:
        "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
      sport: "padel",
      openingHours: "08:00 - 22:00",
      rating: 4.4,
      reviewCount: 56,
      amenities: ["parking", "showers", "lockers"],
    },
    courts: [
      {
        name: "Court 1",
        surface: "artificial_grass",
        type: "indoor",
        pricePerSlot: 17,
        slotDurationMinutes: 90,
      },
      {
        name: "Court 2",
        surface: "artificial_grass",
        type: "indoor",
        pricePerSlot: 17,
        slotDurationMinutes: 90,
      },
    ],
  },
  {
    location: {
      name: "Leuven Padel & Sport",
      address: "Diestsestraat 44",
      city: "Leuven",
      imageUrl:
        "https://okapadel.com/wp-content/uploads/2024/08/descubre-los-cerramientos-del-single-padel-min.webp",
      sport: "padel",
      openingHours: "07:00 - 21:00",
      rating: 4.1,
      reviewCount: 29,
      amenities: ["parking", "lockers"],
    },
    courts: [
      {
        name: "Court 1",
        surface: "hard",
        type: "outdoor",
        pricePerSlot: 15,
        slotDurationMinutes: 90,
      },
      {
        name: "Court 2",
        surface: "clay",
        type: "outdoor",
        pricePerSlot: 13,
        slotDurationMinutes: 90,
      },
    ],
  },
];

export default function SeedCourts() {
  const [done, setDone] = useState(false);

  const seed = async () => {
    try {
      for (const entry of locationsData) {
        const locationRef = await addDoc(
          collection(db, "locations"),
          entry.location,
        );
        for (const court of entry.courts) {
          await addDoc(collection(db, "courts"), {
            ...court,
            locationId: locationRef.id,
          });
        }
      }
      setDone(true);
      Alert.alert(
        "Done",
        "9 locations and their courts added to Firestore. You can delete this screen now.",
      );
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seed Courts</Text>
      <Pressable style={styles.button} onPress={seed} disabled={done}>
        <Text style={styles.buttonText}>
          {done ? "Done!" : "Seed locations & courts"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 30 },
  button: { backgroundColor: "#4CAF50", padding: 16, borderRadius: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
