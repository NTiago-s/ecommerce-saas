"use server";

import { getAdminToken } from "../../../../lib/get-admin-token";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../auth";

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

  const token = await getAdminToken();
  const backendUrl = process.env.MEDUSA_BACKEND_URL;

  try {
    // First get the current product to preserve existing data
    const getProductResponse = await fetch(
      `${backendUrl}/admin/products/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!getProductResponse.ok) {
      throw new Error("No se pudo obtener el producto actual");
    }

    const currentProduct = await getProductResponse.json();
    const currentVariant = currentProduct.product.variants?.[0];

    // Update the product
    const response = await fetch(`${backendUrl}/admin/products/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: productData.title,
        description: productData.description,
        status: productData.status || currentProduct.product.status,
        variants: [
          {
            id: currentVariant?.id,
            title: productData.title,
            sku: productData.sku || currentVariant?.sku,
            prices: [
              {
                id: currentVariant?.prices?.[0]?.id,
                amount: parsePriceToCents(productData.price),
                currency_code: "usd",
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Error al actualizar producto");
    }

    return { success: true, data: data.product };
  } catch (error) {
    console.error("Error detallado:", error);
    return { success: false, error: error.message };
  }
}
