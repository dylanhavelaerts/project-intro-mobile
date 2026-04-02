/**
 * Authentication service for handling user login and registration with Firebase Authentication and Firestore.
 * - loginWithEmail: Logs in a user using email and password
 * - registerWithEmailAndProfile: Registers a new user with email and password, and creates a corresponding user profile in Firestore with additional information (username, sport, level, etc.)
 */

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import { seedRatingFromLevel } from "@/config/rating";
import type { RegisterCredentialsInput } from "../model/types";

export const loginWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmailAndProfile = async ({
  username,
  email,
  password,
  sport,
  level,
}: RegisterCredentialsInput) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  const initialRating = seedRatingFromLevel(level);

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    username: username.trim(),
    email: email.toLowerCase().trim(),
    city: "Antwerp",
    sport,
    level: initialRating,
    rating: initialRating,
    createdAt: new Date().toISOString(),
    profilePhoto: null,
  });

  await signOut(auth);
};
