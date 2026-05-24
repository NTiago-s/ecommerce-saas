"use server";

import { auth } from "../../../../auth";
import { prisma } from "../../../../lib/prisma";
import { callSaasApi, salesChannelHeader } from "../../../../lib/saas-api";

function parsePriceToCents(value) {
  if (value === null || value === undefined) return 0;
  const normalized = String(value).trim().replace(/\s/g, "").replace(",", ".");
  const num = Number.parseFloat(normalized);
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.round(num * 100);
}

export async function updateMedusaProduct(productId, productData, storeId) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { success: false, error: "No autenticado" };

  const userStore = await prisma.store.findFirst({
    where: {
      ownerId: userId,
      ...(storeId ? { id: storeId } : {}),
    },
    select: { medusaSalesChannelId: true },
  });

  if (!userStore?.medusaSalesChannelId) {
    return { success: false, error: "No tienes una tienda configurada" };
  }

  const allowedSalesChannelIds = [userStore.medusaSalesChannelId];

  try {
    const current = await callSaasApi(`/saas/products/${productId}`, {
      method: "GET",
      headers: salesChannelHeader(allowedSalesChannelIds),
    });

    const currentProduct = current.product;
    const currentVariant = currentProduct.variants?.[0];
    const currentPrice = currentVariant?.prices?.[0];

    const data = await callSaasApi(`/saas/products/${productId}`, {
      method: "POST",
      headers: salesChannelHeader(allowedSalesChannelIds),
      body: JSON.stringify({
        title: productData.title,
        description: productData.description,
        status: productData.status || currentProduct.status,
        variants: [
          {
            id: currentVariant?.id,
            title: productData.title,
            sku: productData.sku || currentVariant?.sku,
            prices: [
              {
                id: currentPrice?.id,
                amount: parsePriceToCents(productData.price),
                currency_code: currentPrice?.currency_code || "usd",
              },
            ],
          },
        ],
      }),
    });

    return { success: true, data: data.product };
  } catch (error) {
    console.error("Error actualizando producto:", error);
    return { success: false, error: error.message };
  }
}
