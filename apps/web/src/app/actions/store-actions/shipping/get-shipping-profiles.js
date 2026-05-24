"use server";

import { callSaasApi } from "../../../../../lib/saas-api";

export async function getDefaultShippingProfile() {
  try {
    const data = await callSaasApi("/saas/shipping-profiles", {
      method: "GET",
    });

    const profile =
      data.shipping_profiles?.find((p) => p.type === "default") ||
      data.shipping_profiles?.[0];

    return profile?.id || null;
  } catch (error) {
    console.error("Error obteniendo shipping profile:", error);
    return null;
  }
}
