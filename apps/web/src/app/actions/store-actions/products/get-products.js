"use server";

import { auth } from "../../../../auth";
import { prisma } from "../../../../lib/prisma";
import { callSaasApi, salesChannelHeader } from "../../../../lib/saas-api";

function salesChannelIdsFromStores(stores = []) {
  return stores.map((store) => store.medusaSalesChannelId).filter(Boolean);
}

function productsPath(salesChannelIds = []) {
  const query = new URLSearchParams();
  salesChannelIds.forEach((id) => query.append("sales_channel_id", id));
  const qs = query.toString();
  return qs ? `/saas/products?${qs}` : "/saas/products";
}

export async function getProductsFromMedusa(_regionId, salesChannelIds) {
  const ids = Array.isArray(salesChannelIds)
    ? salesChannelIds.filter(Boolean)
    : [salesChannelIds].filter(Boolean);

  if (!ids.length) return [];

  const data = await callSaasApi(productsPath(ids), {
    method: "GET",
    headers: salesChannelHeader(ids),
  });

  return data.products || [];
}

export async function getProductsGroupedByChannel(_regionId, stores) {
  if (!stores || stores.length === 0) return {};

  const allowedIds = salesChannelIdsFromStores(stores);
  if (!allowedIds.length) return {};

  const data = await callSaasApi(productsPath(allowedIds), {
    method: "GET",
    headers: salesChannelHeader(allowedIds),
  });

  const products = data.products || [];
  const results = {};

  for (const store of stores) {
    if (!store.medusaSalesChannelId) continue;

    results[store.id] = {
      store,
      products: products.filter((product) =>
        (product.sales_channels || []).some(
          (channel) => channel.id === store.medusaSalesChannelId,
        ),
      ),
    };
  }

  return results;
}

export async function getProductById(productId, storeId) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId || !productId) return null;

  const stores = await prisma.store.findMany({
    where: {
      ownerId: userId,
      ...(storeId ? { id: storeId } : {}),
    },
    select: { medusaSalesChannelId: true },
  });

  const allowedIds = salesChannelIdsFromStores(stores);
  if (!allowedIds.length) return null;

  try {
    const data = await callSaasApi(`/saas/products/${productId}`, {
      method: "GET",
      headers: salesChannelHeader(allowedIds),
    });

    return data.product || null;
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error.message);
    return null;
  }
}
