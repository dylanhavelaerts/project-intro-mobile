/**
 * Custom hook for managing the state and logic of the registration form in the welcome flow.
 * - Manages form input states (username, email, password, confirm password)
 * - Manages loading state and form validation errors
 * - Provides a submit function that validates inputs and calls the registration service
 * - Returns all necessary state and handlers for the registration form component
 */

import { useState } from "react";
import type { RegisterSelection, FormErrors } from "../model/types";
import { validateRegisterInputs } from "../validators";
import { registerWithEmailAndProfile } from "../services/authService";

export const useRegisterCredentialsForm = (selection: RegisterSelection) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const submit = async () => {
    const nextErrors = validateRegisterInputs({
      username,
      email,
      password,
      confirmPassword,
    });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return { ok: false as const, errorCode: "validation" };
    }

    setLoading(true);

    try {
      await registerWithEmailAndProfile({
        username,
        email,
        password,
        sport: selection.sport,
        level: selection.level,
      });

      return { ok: true as const };
    } catch (error: any) {
      return { ok: false as const, errorCode: error?.code ?? "unknown" };
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    errors,
    submit,
  };
};
