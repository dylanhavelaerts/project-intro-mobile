/**
 * Custom hook for managing the state of the registration selection process in the welcome flow.
 * - Manages selected sport and level state
 * - Provides a computed boolean `canContinue` to indicate if the user can proceed to the next step based on their selections
 */

import { useState } from "react";

export const useRegisterSelection = () => {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const canContinue = Boolean(selectedSport && selectedLevel);

  return {
    selectedSport,
    setSelectedSport,
    selectedLevel,
    setSelectedLevel,
    canContinue,
  };
};
