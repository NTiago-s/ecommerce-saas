"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import InfoItem from "../../../ui/info-item";
import Button from "../../../ui/button";
import {
  getPrimarySubscription,
  subscriptionStatusLabel,
} from "../../../lib/subscriptions";

export default function ProfileData({ user }) {
  const [loading, setLoading] = useState(false);
  const activeSubscription = getPrimarySubscription(user.subscriptions);
  const planName = activeSubscription?.plan?.name || "Sin plan";
  const subscriptionStatus = activeSubscription?.status || "INCOMPLETE";
  const maxStores = activeSubscription?.plan?.maxStores ?? 0;

  async function handleLogout() {
    setLoading(true);
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <div className="grid gap-6">
      <section className="surface p-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Mi cuenta
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Cuenta y suscripción
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Vista compacta de tu perfil, estado del plan y accesos de seguridad.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <InfoItem label="Plan actual" value={planName} />
        <InfoItem
          label="Estado"
          value={subscriptionStatusLabel(subscriptionStatus)}
          badge
        />
        <InfoItem label="Tiendas permitidas" value={maxStores} />
      </section>

      <section className="surface p-6">
        <h3 className="text-lg font-semibold tracking-tight text-slate-950">
          Datos personales
        </h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <InfoItem label="Email" value={user.email} />
          <InfoItem label="Teléfono" value={user.phone || "No especificado"} />
          <InfoItem
            label="Fecha de registro"
            value={new Date(user.createdAt).toLocaleDateString("es-AR")}
          />
        </div>
      </section>

      <section className="surface p-6">
        <h3 className="text-lg font-semibold tracking-tight text-slate-950">
          Seguridad
        </h3>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="outline" type="button">
            Cambiar contraseña
          </Button>
          <Button
            variant="primary"
            type="button"
            disabled={loading}
            onClick={handleLogout}
          >
            {loading ? "Cerrando sesión..." : "Cerrar sesión"}
          </Button>
        </div>
      </section>
    </div>
  );
}
