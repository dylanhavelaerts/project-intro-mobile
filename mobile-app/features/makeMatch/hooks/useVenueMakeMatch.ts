/**
 * Hook for managing state and logic related to making a match at a venue, including loading venue details, 
 * managing bookings and matches for a selected date, and handling booking and match creation actions.
 * - Loads venue details (location and courts) based on the provided location ID
 * - Generates available time slots based on venue opening hours and selected match duration
 * - Fetches existing bookings and matches for the selected date to determine availability
 * - Provides functions to book a court directly or create/join a match, with appropriate checks and user feedback
 */

import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import type { Court, Location } from "@/types";
import {
  createBooking,
  createMatch,
  fetchBookingsForDay,
  fetchMatchesForDay,
  joinMatch,
  loadVenueDetails,
} from "../services/makeMatchService";
import type { Booking, DurationMinutes, MatchDoc, MatchTab } from "../model/types";
import {
  generateDays,
  minutesToHHMM,
  overlaps,
  parseHHMMToMinutes,
  parseOpeningHours,
  toDateKeyLocal,
} from "../utils/dateTime";

export const useVenueMakeMatch = (locationId?: string) => {
  const [activeTab, setActiveTab] = useState<MatchTab>("Book");
  const [showAvailable, setShowAvailable] = useState(true);
  const [durationMinutes, setDurationMinutes] = useState<DurationMinutes>(90);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("");

  const [matches, setMatches] = useState<MatchDoc[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);

  const [showCreateMatch, setShowCreateMatch] = useState(false);
  const [levelMin, setLevelMin] = useState("1.0");
  const [levelMax, setLevelMax] = useState("3.0");
  const [mixed, setMixed] = useState(false);
  const [competitive, setCompetitive] = useState(false);

  const [location, setLocation] = useState<Location | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingBusy, setBookingBusy] = useState(false);

  const dateKey = useMemo(() => toDateKeyLocal(selectedDate), [selectedDate]);
  const days = useMemo(() => generateDays(7), []);

  useEffect(() => {
    const loadVenue = async () => {
      if (!locationId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const details = await loadVenueDetails(locationId);
        setLocation(details.location);
        setCourts(details.courts);
      } catch (e) {
        Alert.alert("Error", String(e));
      } finally {
        setLoading(false);
      }
    };

    loadVenue();
  }, [locationId]);

  useEffect(() => {
    const { open, close } = parseOpeningHours(location?.openingHours ?? null);
    const step = 30;
    const slots: string[] = [];

    for (let t = open; t + durationMinutes <= close; t += step) {
      slots.push(minutesToHHMM(t));
    }

    setTimeSlots(slots);
    if (slots.length === 0) {
      setSelectedTime("");
      return;
    }
    if (!selectedTime || !slots.includes(selectedTime)) {
      setSelectedTime(slots[0]);
    }
  }, [location?.openingHours, durationMinutes, selectedTime]);

  const loadBookingsAndMatches = async () => {
    if (!locationId) return;

    try {
      const bookingsData = await fetchBookingsForDay(locationId, dateKey);
      setBookings(bookingsData);
    } catch (e) {
      Alert.alert("Error", String(e));
    }

    try {
      setMatchesLoading(true);
      const matchesData = await fetchMatchesForDay(locationId, dateKey);
      setMatches(matchesData);
    } catch (e) {
      Alert.alert("Error", String(e));
    } finally {
      setMatchesLoading(false);
    }
  };

  useEffect(() => {
    loadBookingsAndMatches();
  }, [locationId, dateKey]);

  const getSelectedStartMinute = () => {
    if (!selectedTime) return null;
    return parseHHMMToMinutes(selectedTime);
  };

  const isCourtAvailable = (courtId: string) => {
    const startMinute = getSelectedStartMinute();
    if (startMinute == null) return false;

    const endMinute = startMinute + durationMinutes;
    const hasOverlap = bookings.some(
      (b) =>
        b.courtId === courtId &&
        overlaps(b.startMinute, b.endMinute, startMinute, endMinute),
    );

    return !hasOverlap;
  };

  const priceForDuration = (court: Court) => {
    const perMinute =
      court.slotDurationMinutes > 0
        ? court.pricePerSlot / court.slotDurationMinutes
        : 0;
    return `€ ${(perMinute * durationMinutes).toFixed(2)}`;
  };

  const handleBook = async (court: Court) => {
    if (!locationId) return;

    const startMinute = getSelectedStartMinute();
    if (startMinute == null) {
      Alert.alert("Pick a time", "Please select a start time first.");
      return;
    }

    try {
      setBookingBusy(true);
      const latest = await fetchBookingsForDay(locationId, dateKey);
      const endMinute = startMinute + durationMinutes;
      const conflict = latest.some(
        (b) =>
          b.courtId === court.id &&
          overlaps(b.startMinute, b.endMinute, startMinute, endMinute),
      );

      if (conflict) {
        Alert.alert(
          "Not available",
          "Someone just booked this slot. Pick another time.",
        );
        return;
      }

      await createBooking({
        locationId,
        court,
        dateKey,
        startMinute,
        durationMinutes,
      });

      await loadBookingsAndMatches();
      Alert.alert(
        "Booked!",
        `${court.name} at ${minutesToHHMM(startMinute)} (${durationMinutes}min)`,
      );
    } catch (e) {
      Alert.alert("Error", String(e));
    } finally {
      setBookingBusy(false);
    }
  };

  const handleCreateMatch = async () => {
    if (!locationId) return;

    const startMinute = getSelectedStartMinute();
    if (startMinute == null) {
      Alert.alert("Pick a time", "Please select a start time first.");
      return;
    }

    const min = Number(levelMin.replace(",", "."));
    const max = Number(levelMax.replace(",", "."));

    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      Alert.alert("Invalid level range", "Enter valid numbers for min/max.");
      return;
    }
    if (min > max) {
      Alert.alert("Invalid level range", "Min level must be ≤ max level.");
      return;
    }

    try {
      setBookingBusy(true);
      await createMatch({
        locationId,
        dateKey,
        startMinute,
        durationMinutes,
        levelMin: min,
        levelMax: max,
        mixed,
        competitive,
      });

      setShowCreateMatch(false);
      await loadBookingsAndMatches();
      Alert.alert("Match created", "Your match is now visible in Open Matches.");
    } catch (e) {
      Alert.alert("Error", String(e));
    } finally {
      setBookingBusy(false);
    }
  };

  const handleJoinMatch = async (matchId: string) => {
    try {
      setBookingBusy(true);
      const result = await joinMatch(matchId);

      if (result.status === "not_found") {
        Alert.alert("Error", "Match not found.");
        return;
      }
      if (result.status === "already_joined") {
        Alert.alert("Already joined", "You are already in this match.");
        return;
      }
      if (result.status === "full") {
        Alert.alert("Match full", "This match is already full.");
        return;
      }

      await loadBookingsAndMatches();
      Alert.alert("Joined!", "You have joined the match.");
    } catch (e) {
      Alert.alert("Error", String(e));
    } finally {
      setBookingBusy(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    showAvailable,
    setShowAvailable,
    durationMinutes,
    setDurationMinutes,
    selectedDate,
    setSelectedDate,
    timeSlots,
    selectedTime,
    setSelectedTime,
    matches,
    matchesLoading,
    showCreateMatch,
    setShowCreateMatch,
    levelMin,
    setLevelMin,
    levelMax,
    setLevelMax,
    mixed,
    setMixed,
    competitive,
    setCompetitive,
    location,
    courts,
    loading,
    bookingBusy,
    dateKey,
    days,
    isCourtAvailable,
    priceForDuration,
    handleBook,
    handleCreateMatch,
    handleJoinMatch,
  };
};
