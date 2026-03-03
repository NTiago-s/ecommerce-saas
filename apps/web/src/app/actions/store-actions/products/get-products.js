"use server";

import { getAdminToken } from "../../../../lib/get-admin-token";

const backendUrl = process.env.MEDUSA_BACKEND_URL;

export async function getProductsFromMedusa(regionId, salesChannelIds) {
  const token = await getAdminToken();

  if (!salesChannelIds || salesChannelIds.length === 0) return [];

  const query = new URLSearchParams({
    region_id: regionId,
    fields: "*variants.prices",
  });

  // Add multiple sales channels to query
  if (Array.isArray(salesChannelIds)) {
    salesChannelIds.forEach((id) => {
      query.append("sales_channel_id[]", id);
    });
  } else {
    // Single sales channel (backward compatibility)
    query.append("sales_channel_id[]", salesChannelIds);
  }

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

// New function to get products grouped by sales channel
export async function getProductsGroupedByChannel(regionId, stores) {
  const token = await getAdminToken();

  if (!stores || stores.length === 0) return {};

  const results = {};

  for (const store of stores) {
    if (!store.medusaSalesChannelId) continue;

    const query = new URLSearchParams({
      region_id: regionId,
      "sales_channel_id[]": store.medusaSalesChannelId,
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
    results[store.id] = {
      store,
      products: data.products || [],
    };
  }

  return results;
}
