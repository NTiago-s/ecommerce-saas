"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2, Mail, ArrowRight, AlertCircle } from "lucide-react";
import AuthShell from "../../components/auth/auth-shell";
import Button from "../../ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResetLink("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar instrucciones");
      }

      setResetLink(data.resetLink || "");
      setSuccess(true);
    } catch (err) {
      setError(err?.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <AuthShell
        badge="Recuperación"
        title="Revisa tu correo"
        description={`Si existe una cuenta con ${email}, vas a recibir un enlace para restablecer la contraseña.`}
      >
        <div className="flex h-full flex-col justify-center">
          <div className="space-y-5">
            <div className="inline-flex size-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">
              <CheckCircle className="size-7" aria-hidden="true" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Instrucciones enviadas
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Si el correo está registrado, vas a ver el enlace de recuperación.
              </p>
            </div>

            {resetLink ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
                <p className="font-semibold">Modo desarrollo</p>
                <a
                  href={resetLink}
                  className="mt-2 block break-all underline underline-offset-4"
                >
                  {resetLink}
                </a>
              </div>
            ) : null}

            <Button type="button" size="lg" fullWidth onClick={() => router.push("/login")}>
              Volver al login
            </Button>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      badge="Recuperación"
      title="Recupera tu contraseña"
      description="Escribe tu email y te enviamos el enlace para crear una nueva contraseña."
      footer={
        <p className="text-center text-sm text-slate-500">
          ¿Recordaste tu contraseña?{" "}
          <button
            onClick={() => router.push("/login")}
            className="font-semibold text-[var(--accent)] hover:underline"
            type="button"
          >
            Volver al login
          </button>
        </p>
      }
    >
      <div className="flex h-full flex-col justify-center">
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Correo electrónico
            </span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="usuario@correo.com"
                className="w-full rounded-2xl border border-[var(--border)] bg-slate-50 px-11 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </label>

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
                <span>Enviando</span>
              </>
            ) : (
              <>
                <span>Enviar instrucciones</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </>
            )}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}

