"use server";

import { getAdminToken } from "../../../../lib/get-admin-token";

const backendUrl = process.env.MEDUSA_BACKEND_URL;

export async function getProductsFromMedusa(regionId, salesChannelId) {
  console.log("regionId", regionId);
  console.log("salesChannelId", salesChannelId);
  const token = await getAdminToken();

  if (!salesChannelId) return [];

  const query = new URLSearchParams({
    region_id: regionId,
    "sales_channel_id[]": salesChannelId,
    fields: "*variants.prices",
  });

  const res = await fetch(`${backendUrl}/admin/products?${query}`, {
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 0 },
  });

  const data = await res.json();
  return data.products || [];
}
