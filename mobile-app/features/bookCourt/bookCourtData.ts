/**
 * This file contains all data fetching and persistence logic related to the Book Court feature, including:
 * - Fetching and structuring location and court data for the Book Court list screen
 * - Fetching and persisting user's favorite locations
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { getPersistedFavoriteLocationIds } from "@/features/shared/favorites";
import {
  BookCourtListItem,
  BookCourtRawCourt,
  BookCourtRawLocation,
} from "./types";

const buildCourtsByLocation = (courtDocs: BookCourtRawCourt[]) => {
  return courtDocs.reduce<Record<string, BookCourtRawCourt[]>>((acc, court) => {
    if (!court.locationId) return acc;
    if (!acc[court.locationId]) {
      acc[court.locationId] = [];
    }
    acc[court.locationId].push(court);
    return acc;
  }, {});
};

const mapLocationToListItem = (
  id: string,
  location: BookCourtRawLocation,
  linkedCourts: BookCourtRawCourt[],
): BookCourtListItem => {
  const minPrice =
    linkedCourts.length > 0
      ? Math.min(...linkedCourts.map((court) => court.pricePerSlot ?? 0))
      : 0;

  const duration = linkedCourts[0]?.slotDurationMinutes
    ? `${linkedCourts[0].slotDurationMinutes}min`
    : "90min";

  const city = location.city ?? "Unknown city";

  return {
    id,
    name: location.name ?? "Unknown location",
    image: { uri: location.imageUrl ?? "" },
    price: `€ ${minPrice}`,
    duration,
    distance: city,
    location: `${location.address ?? "Address unknown"}, ${city}`,
    timeSlots: [],
    sport: location.sport?.toLowerCase() === "tennis" ? "tennis" : "padel",
    openingHours: location.openingHours,
  };
};

export const fetchBookCourtListItems = async (): Promise<BookCourtListItem[]> => {
  const [locationSnap, courtsSnap] = await Promise.all([
    getDocs(collection(db, "locations")),
    getDocs(collection(db, "courts")),
  ]);

  const rawCourts = courtsSnap.docs.map((snap) =>
    snap.data(),
  ) as BookCourtRawCourt[];

  const courtsByLocation = buildCourtsByLocation(rawCourts);

  return locationSnap.docs.map((snap) => {
    const location = snap.data() as BookCourtRawLocation;
    const linkedCourts = courtsByLocation[snap.id] ?? [];
    return mapLocationToListItem(snap.id, location, linkedCourts);
  });
};

export const fetchUserFavoriteLocationIds = async (
  userId: string,
): Promise<string[]> => {
  const userSnap = await getDoc(doc(db, "users", userId));
  const userData = userSnap.exists() ? userSnap.data() : null;
  return getPersistedFavoriteLocationIds(userData);
};

export const persistUserFavoriteLocationIds = async (
  userId: string,
  favoriteLocationIds: string[],
) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    await updateDoc(userRef, {
      favoriteLocationIds,
    });
    return;
  }

  await setDoc(
    userRef,
    {
      uid: userId,
      favoriteLocationIds,
    },
    { merge: true },
  );
};
