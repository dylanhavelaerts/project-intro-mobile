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
        "https://images.unsplash.com/photo-1593786082050-2492261a8c7b?w=800",
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
      name: "Gent Padel Center",
      address: "Veldstraat 3",
      city: "Ghent",
      imageUrl:
        "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800",
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
        "3 locations and 8 courts added to Firestore. You can delete this screen now.",
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
