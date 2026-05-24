"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, CheckCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import AuthShell from "../../components/auth/auth-shell";
import Button from "../../ui/button";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    async function verifyToken(tokenParam) {
      try {
        const response = await fetch(
          `/api/auth/reset-password?token=${encodeURIComponent(tokenParam)}`,
          { cache: "no-store" },
        );
        const data = await response.json();

        if (!response.ok || !data.valid) {
          throw new Error(data.error || "El enlace no es válido o expiró");
        }

        setToken(tokenParam);
      } catch (err) {
        setError(err?.message || "El enlace no es válido o expiró");
      } finally {
        setVerifying(false);
      }
    }

    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError("El enlace no es válido o expiró");
      setVerifying(false);
      return;
    }

    verifyToken(tokenParam);
  }, [searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al restablecer contraseña");
      }

      setSuccess(true);
    } catch (err) {
      setError(err?.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  }

  if (verifying) {
    return (
      <AuthShell
        badge="Seguridad"
        title="Verificando enlace"
        description="Estamos validando que el enlace de recuperación siga vigente."
      >
        <div className="flex min-h-[380px] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[var(--accent)]" />
        </div>
      </AuthShell>
    );
  }

  if (success) {
    return (
      <AuthShell
        badge="Seguridad"
        title="Contraseña restablecida"
        description="Tu contraseña fue actualizada correctamente. Ya puedes iniciar sesión."
      >
        <div className="flex h-full flex-col justify-center gap-5">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">
            <CheckCircle className="size-7" aria-hidden="true" />
          </div>
          <Button type="button" size="lg" fullWidth onClick={() => router.push("/login")}>
            Iniciar sesión
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      badge="Seguridad"
      title="Crea una nueva contraseña"
      description="Elegí una contraseña nueva para volver a acceder a tu cuenta."
    >
      <div className="flex h-full flex-col justify-center">
        {error && !token ? (
          <div className="space-y-4">
            <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4" aria-hidden="true" />
              <p>{error}</p>
            </div>
            <Button type="button" size="lg" fullWidth onClick={() => router.push("/forgot-password")}>
              Solicitar un nuevo enlace
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Nueva contraseña
                </span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-[var(--border)] bg-slate-50 px-11 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-blue-100"
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
                  Confirmar contraseña
                </span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-[var(--border)] bg-slate-50 px-11 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-blue-100"
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
                  <span>Restableciendo</span>
                </>
              ) : (
                <>
                  <span>Restablecer contraseña</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-4">
          <Loader2 className="size-8 animate-spin text-[var(--accent)]" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

