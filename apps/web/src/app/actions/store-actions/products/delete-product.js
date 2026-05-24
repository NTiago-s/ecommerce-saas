"use server";

import { auth } from "../../../../auth";
import { prisma } from "../../../../lib/prisma";
import { callSaasApi, salesChannelHeader } from "../../../../lib/saas-api";

async function getAllowedSalesChannelIds(userId, storeId) {
  const stores = await prisma.store.findMany({
    where: {
      ownerId: userId,
      ...(storeId ? { id: storeId } : {}),
    },
    select: { medusaSalesChannelId: true },
  });

  return stores.map((store) => store.medusaSalesChannelId).filter(Boolean);
}

export async function deleteMedusaProduct(productId, storeId) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { success: false, error: "No autenticado" };

  const allowedSalesChannelIds = await getAllowedSalesChannelIds(
    userId,
    storeId,
  );

  if (!allowedSalesChannelIds.length) {
    return { success: false, error: "No tienes una tienda configurada" };
  }

  try {
    await callSaasApi(`/saas/products/${productId}`, {
      method: "DELETE",
      headers: salesChannelHeader(allowedSalesChannelIds),
    });

    return { success: true };
  } catch (error) {
    console.error("Error eliminando producto:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleProductStatus(productId, storeId) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { success: false, error: "No autenticado" };

  const allowedSalesChannelIds = await getAllowedSalesChannelIds(
    userId,
    storeId,
  );

  if (!allowedSalesChannelIds.length) {
    return { success: false, error: "No tienes una tienda configurada" };
  }

  try {
    const current = await callSaasApi(`/saas/products/${productId}`, {
      method: "GET",
      headers: salesChannelHeader(allowedSalesChannelIds),
    });

    const newStatus =
      current.product.status === "published" ? "draft" : "published";

    const data = await callSaasApi(`/saas/products/${productId}`, {
      method: "POST",
      headers: salesChannelHeader(allowedSalesChannelIds),
      body: JSON.stringify({ status: newStatus }),
    });

    return { success: true, data: data.product };
  } catch (error) {
    console.error("Error cambiando estado del producto:", error);
    return { success: false, error: error.message };
  }
}
