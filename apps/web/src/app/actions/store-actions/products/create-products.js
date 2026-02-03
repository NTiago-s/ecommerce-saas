"use server";

import { getAdminToken } from "../../../../lib/get-admin-token";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../auth";

export async function createMedusaProduct(formData) {
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
    const response = await fetch(`${backendUrl}/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        status: "published",
        // Vinculación al canal del usuario
        sales_channels: [{ id: userStore.medusaSalesChannelId }],
        shipping_profile_id: "sp_01KEWKFBBTP3ZB2CD807DMQQET",
        options: [{ title: "Size", values: ["Default"] }],
        variants: [
          {
            title: "Original",
            sku: `sku-${Date.now()}`,
            // NOTA: inventory_quantity se eliminó porque da error en v2
            // manage_inventory: true, // Opcional en algunas configs
            prices: [
              {
                amount: Math.round(parseFloat(formData.price) * 100),
                currency_code: "usd",
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Error al crear producto");

    return { success: true, data };
  } catch (error) {
    console.error("Error detallado:", error);
    return { success: false, error: error.message };
  }
}
