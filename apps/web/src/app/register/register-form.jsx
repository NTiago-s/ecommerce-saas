"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { registerUser } from "../actions/auth-actions/register";

export default function RegisterForm() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await registerUser(formData);

      // Login automático después del register
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      window.location.href = "/create-store";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />

      <input name="password" type="password" placeholder="Password" required />

      <button type="submit" disabled={loading}>
        {loading ? "Creando..." : "Crear cuenta"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
