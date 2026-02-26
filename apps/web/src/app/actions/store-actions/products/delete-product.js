"use server";

import { getAdminToken } from "../../../../lib/get-admin-token";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../auth";

export async function deleteMedusaProduct(productId) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { success: false, error: "No autenticado" };

  const userStore = await prisma.store.findFirst({
    where: { ownerId: userId },
    select: { medusaSalesChannelId: true },
  });

  if (!userStore?.medusaSalesChannelId) {
    return { success: false, error: "No tienes una tienda configurada" };
  }

  const token = await getAdminToken();
  const backendUrl = process.env.MEDUSA_BACKEND_URL;

  try {
    const response = await fetch(`${backendUrl}/admin/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Error al eliminar producto");
    }

    return { success: true };
  } catch (error) {
    console.error("Error detallado:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleProductStatus(productId) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { success: false, error: "No autenticado" };

  const userStore = await prisma.store.findFirst({
    where: { ownerId: userId },
    select: { medusaSalesChannelId: true },
  });

  if (!userStore?.medusaSalesChannelId) {
    return { success: false, error: "No tienes una tienda configurada" };
  }

  const token = await getAdminToken();
  const backendUrl = process.env.MEDUSA_BACKEND_URL;

  try {
    // First get current product
    const getProductResponse = await fetch(`${backendUrl}/admin/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!getProductResponse.ok) {
      throw new Error("No se pudo obtener el producto actual");
    }

    const currentProduct = await getProductResponse.json();
    const newStatus = currentProduct.product.status === 'published' ? 'draft' : 'published';

    // Update product status
    const response = await fetch(`${backendUrl}/admin/products/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Error al cambiar estado del producto");
    }

    return { success: true, data: data.product };
  } catch (error) {
    console.error("Error detallado:", error);
    return { success: false, error: error.message };
  }
}
