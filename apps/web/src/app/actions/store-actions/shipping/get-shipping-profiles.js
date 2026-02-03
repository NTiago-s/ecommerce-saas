"use server";

import { getAdminToken } from "../../../../../lib/get-admin-token";

export async function getDefaultShippingProfile() {
  const token = await getAdminToken();
  const backendUrl = process.env.MEDUSA_BACKEND_URL;

  try {
    const res = await fetch(`${backendUrl}/admin/shipping-profiles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    // Medusa v2 devuelve shipping_profiles.
    // Buscamos el que sea de tipo "default" o simplemente el primero.
    const profile =
      data.shipping_profiles?.find((p) => p.type === "default") ||
      data.shipping_profiles?.[0];

    return profile?.id || null;
  } catch (error) {
    console.error("Error obteniendo shipping profile:", error);
    return null;
  }
}
