"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail, Loader2, Phone } from "lucide-react";
import { registerUser } from "../actions/auth-actions/register";
import AuthShell from "../../components/auth/auth-shell";
import Button from "../../ui/button";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const planName = searchParams.get("plan");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

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
        throw new Error("No se pudo iniciar sesion automaticamente");
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err?.message || "Ocurrio un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      badge={planName ? `Plan: ${planName}` : "Registro"}
      title="Crea tu cuenta"
      description="Crea tu cuenta para lanzar tu ecommerce con el plan que mejor encaje con tu negocio."
      footer={
        <p className="text-center text-sm text-slate-500">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--accent)] hover:underline"
          >
            Inicia sesion
          </Link>
        </p>
      }
    >
      <div className="flex h-full flex-col justify-center">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Correo electronico
              </span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="usuario@correo.com"
                  className="w-full rounded-2xl border border-[var(--border)] bg-slate-50 px-11 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-blue-100"
                  aria-invalid={error ? "true" : "false"}
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Contraseña
              </span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-[var(--border)] bg-slate-50 px-11 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-blue-100"
                  aria-invalid={error ? "true" : "false"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Telefono
              </span>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="3756457410"
                  className="w-full rounded-2xl border border-[var(--border)] bg-slate-50 px-11 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-blue-100"
                  aria-invalid={error ? "true" : "false"}
                />
              </div>
            </label>
          </div>

          {error ? (
            <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4" aria-hidden="true" />
              <p>{error}</p>
            </div>
          ) : null}

          <Button type="submit" size="lg" fullWidth disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                <span>Creando cuenta</span>
              </>
            ) : (
              <>
                <span>Crear cuenta</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </>
            )}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
