// app/actions.ts
"use server";

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL as string;
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string;
export interface Region {
  id: string;
  name: string;
  currency_code: string;
}

export interface MoneyAmount {
  amount: number;
  currency_code: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  prices?: MoneyAmount[];
  calculated_price?: {
    calculated_amount: number;
    currency_code: string;
  };
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  variants?: ProductVariant[];
}

export async function getRegions(): Promise<Region[]> {
  const res = await fetch(`${MEDUSA_URL}/store/regions`, {
    headers: {
      "x-publishable-api-key": API_KEY,
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch regions");
  }

  const data: { regions: Region[] } = await res.json();
  return data.regions ?? [];
}

export async function getProductsFromMedusa(
  regionId: string
): Promise<Product[]> {
  const query = new URLSearchParams({
    region_id: regionId,
    fields: "*variants.prices,*variants.calculated_price",
  });

  const res = await fetch(
    `${MEDUSA_URL}/store/products?${query.toString()}`,
    {
      headers: {
        "x-publishable-api-key": API_KEY,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: { products: Product[] } = await res.json();
  return data.products ?? [];
}
