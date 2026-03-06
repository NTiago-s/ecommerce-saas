/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(
          res.error === "CredentialsSignin"
            ? "Credenciales inválidas. Inténtalo de nuevo."
            : res.error,
        );
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Ocurrió un error inesperado.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <section
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
        aria-labelledby="login-title"
      >
        {/* Header */}
        <header className="text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4 shadow-lg shadow-blue-200"
            aria-hidden="true"
          >
            <Lock size={30} />
          </div>
          <h1
            id="login-title"
            className="text-3xl font-extrabold text-slate-900"
          >
            Bienvenido
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Ingresa a tu panel de control de E-commerce
          </p>
        </header>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <fieldset className="space-y-4">
            <legend className="sr-only">Información de inicio de sesión</legend>
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="ejemplo@correo.com"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all sm:text-sm cursor-pointer"
                  aria-describedby="email-help"
                  aria-invalid={error ? "true" : "false"}
                />
                <span id="email-help" className="sr-only">
                  Ingresa tu correo electrónico registrado
                </span>
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center ml-1">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                >
                  Contraseña
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-1 py-0.5"
                  aria-label="Recuperar contraseña olvidada"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <div className="relative mt-1">
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"
                  aria-hidden="true"
                >
                  <Lock size={18} />
                </div>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all sm:text-sm cursor-pointer"
                  aria-describedby="password-help"
                  aria-invalid={error ? "true" : "false"}
                />
                <span id="password-help" className="sr-only">
                  Ingresa tu contraseña para acceder
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
            aria-label="Iniciar sesión en tu cuenta"
            aria-describedby="submit-help"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              <span className="flex items-center gap-2">
                Iniciar Sesión
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </span>
            )}
          </button>
          <span id="submit-help" className="sr-only">
            Presiona para iniciar sesión con tus credenciales
          </span>
        </form>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-500">
          <p>
            ¿No tienes una cuenta?{" "}
            <a
              href="/register"
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-1 py-0.5"
              aria-label="Crear una nueva cuenta"
            >
              Regístrate gratis
            </a>
          </p>
        </footer>
      </section>
    </main>
  );
}
