"use client";
import { signOut } from "next-auth/react";
import InfoItem from "../../../ui/info-item";
import { useState } from "react";

export default function ProfileData({ user }) {
  console.log("ProfileData", user);

  const [loading, setLoading] = useState(false);

  // Obtener la suscripción activa más reciente
  const activeSubscription =
    user.subscriptions?.length > 0
      ? user.subscriptions.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )[0]
      : null;

  const planName = activeSubscription?.plan?.name || "Free";
  const subscriptionStatus = activeSubscription?.status || "Activo";
  const maxStores = activeSubscription?.plan?.maxStores ?? 1;

  const statusSub =
    subscriptionStatus === "TRIAL"
      ? "Trial"
      : subscriptionStatus === "ACTIVE"
        ? "Activo"
        : subscriptionStatus === "PAST_DUE"
          ? "Vencido"
          : subscriptionStatus === "CANCELED"
            ? "Cancelado"
            : subscriptionStatus === "INCOMPLETE"
              ? "Incompleto"
              : "Desconocido";

  function handleLogout() {
    setLoading(true);
    signOut({ callbackUrl: "/login" });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Mi cuenta</h2>
        <p className="text-gray-500">
          Información de tu cuenta y estado del servicio
        </p>
      </div>

      {/* Datos del usuario */}
      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Datos personales
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem label="Email" value={user.email} />
          <InfoItem label="Telefono" value={user.phone || "No especificado"} />
          <InfoItem
            label="Fecha de registro"
            value={new Date(user.createdAt).toLocaleDateString()}
          />
        </div>
      </section>

      {/* Plan / suscripción */}
      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Plan y suscripción
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoItem label="Plan actual" value={planName} />
          <InfoItem label="Estado" value={statusSub} badge />
          <InfoItem label="Tiendas permitidas" value={maxStores} />
        </div>

        <div className="pt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
            aria-label="boton gestionar suscripcion"
          >
            Gestionar suscripción
          </button>
        </div>
      </section>

      {/* Seguridad */}
      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Seguridad</h3>

        <div className="flex flex-wrap gap-4">
          <button
            aria-label="boton cambiar contraseña"
            className="border px-4 py-2 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            Cambiar contraseña
          </button>

          <button
            disabled={loading}
            onClick={handleLogout}
            aria-label="boton cerrar sesion"
            className="border border-red-500 text-red-600 px-4 py-2 rounded-md hover:bg-red-50 cursor-pointer"
          >
            {loading ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      </section>
    </div>
  );
}
