// app/actions.js
"use server";

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL;
const API_KEY = process.env.MEDUSA_PUBLIC_KEY;

export async function getRegions() {
  const res = await fetch(`${MEDUSA_URL}/store/regions`, {
    headers: { "x-publishable-api-key": API_KEY },
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  return data.regions || [];
}

export async function getProductsFromMedusa(regionId) {
  const query = new URLSearchParams({
    region_id: regionId,
    fields: "*variants.prices,*variants.calculated_price",
  });

  const res = await fetch(`${MEDUSA_URL}/store/products?${query}`, {
    headers: { "x-publishable-api-key": API_KEY },
    cache: "no-store",
  });
  const data = await res.json();
  return data.products || [];
}
