/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { registerUser } from "../actions/auth-actions/register";
import {
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  Phone,
} from "lucide-react";
import Link from "next/link";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await registerUser(formData);

      const res = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        phone: formData.get("phone"),
        redirect: false,
      });

      if (res?.error) {
        throw new Error("Error al iniciar sesión automáticamente");
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <section
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
        aria-labelledby="register-title"
      >
        {/* Header */}
        <header className="text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4 shadow-lg shadow-blue-200"
            aria-hidden="true"
          >
            <User size={30} />
          </div>
          <h1
            id="register-title"
            className="text-3xl font-extrabold text-slate-900"
          >
            Crear cuenta
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Registrate para comenzar a vender online
          </p>
        </header>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <fieldset className="space-y-4">
            <legend className="sr-only">
              Información de registro de cuenta
            </legend>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1 block"
              >
                Correo Electrónico
              </label>
              <div className="relative mt-1">
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"
                  aria-hidden="true"
                >
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="ejemplo@correo.com"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all sm:text-sm cursor-pointer"
                  aria-describedby="email-help"
                  aria-invalid={error ? "true" : "false"}
                />
                <span id="email-help" className="sr-only">
                  Ingresa tu correo electrónico para crear la cuenta
                </span>
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1 block"
              >
                Contraseña
              </label>
              <div className="relative mt-1">
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"
                  aria-hidden="true"
                >
                  <Lock size={18} />
                </div>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all sm:text-sm cursor-pointer"
                  aria-describedby="password-help password-requirements"
                  aria-invalid={error ? "true" : "false"}
                />
                <span id="password-help" className="sr-only">
                  Crea una contraseña segura para tu cuenta
                </span>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff size={18} aria-hidden="true" />
                  ) : (
                    <Eye size={18} aria-hidden="true" />
                  )}
                </button>
              </div>
              <p
                id="password-requirements"
                className="mt-1 text-[11px] text-slate-400"
              >
                Mínimo 8 caracteres, un número y una letra
              </p>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1 block"
              >
                Teléfono
              </label>
              <div className="relative mt-1">
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"
                  aria-hidden="true"
                >
                  <Phone size={18} />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="123456789"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all sm:text-sm cursor-pointer"
                  aria-describedby="phone-help"
                  aria-invalid={error ? "true" : "false"}
                />
                <span id="phone-help" className="sr-only">
                  Ingresa tu número de teléfono para contacto
                </span>
              </div>
            </div>
          </fieldset>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg animate-in fade-in duration-300"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle size={18} aria-hidden="true" />
              <p>{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Crear nueva cuenta"
            aria-describedby="submit-help"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              <span className="flex items-center gap-2">
                Crear cuenta
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </span>
            )}
          </button>
          <span id="submit-help" className="sr-only">
            Presiona para crear tu cuenta y comenzar a vender
          </span>
        </form>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-500">
          <p>
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-1 py-0.5"
              aria-label="Iniciar sesión en cuenta existente"
            >
              Inicia sesión
            </Link>
          </p>
        </footer>
      </section>
    </main>
  );
}
