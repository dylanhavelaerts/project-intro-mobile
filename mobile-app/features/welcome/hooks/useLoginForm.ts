import { useState } from "react";
import { loginWithEmail } from "../services/authService";
import { validateLoginInputs } from "../validators";
import type { FormErrors } from "../model/types";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const submit = async () => {
    const nextErrors = validateLoginInputs(email, password);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return { ok: false as const, errorCode: "validation" };
    }

    setLoading(true);

    try {
      await loginWithEmail(email.trim(), password);
      return { ok: true as const };
    } catch (error: any) {
      return { ok: false as const, errorCode: error?.code ?? "unknown" };
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    errors,
    submit,
  };
};
