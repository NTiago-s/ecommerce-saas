"use server";

import { getAdminToken } from "../../../../lib/get-admin-token";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../auth";

export async function createSalesChannel({
  name,
  description,
  enabled,
  subdomain,
}) {
  // 1. Autenticación
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Debes estar autenticado");

  // 2. VERIFICACIÓN DE SUSCRIPCIÓN Y LÍMITES
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: userId,
      status: { in: ["ACTIVE", "TRIAL"] }, // Solo permitimos si está al día o en prueba
    },
    include: {
      plan: true,
      _count: {
        select: { stores: true }, // Contamos cuántas tiendas ya tiene esta suscripción
      },
    },
  });

  if (!subscription) {
    throw new Error(
      "No tienes una suscripción activa. Por favor, selecciona un plan.",
    );
  }

  console.log(
    "subscription",
    subscription.plan.maxStores &&
      subscription._count.stores >= subscription.plan.maxStores,
  );

  // 3. VERIFICAR LÍMITE DE TIENDAS (maxStores)
  if (
    subscription.plan.maxStores &&
    subscription._count.stores >= subscription.plan.maxStores
  ) {
    throw new Error(
      `Tu plan ${subscription.plan.name} solo permite ${subscription.plan.maxStores} tienda(s).`,
    );
  }

  // 4. Crear la tienda en Prisma incluyendo el subscriptionId
  // Nota: Tu schema exige subscriptionId, si no lo pones aquí, Prisma dará error.
  const newStore = await prisma.store.create({
    data: {
      name,
      subdomain,
      ownerId: userId,
      subscriptionId: subscription.id, // Vínculo obligatorio según tu schema
    },
  });

  try {
    const token = await getAdminToken();
    const baseUrl = process.env.MEDUSA_BACKEND_URL;

    // 5. Crear el Sales Channel en Medusa
    const res = await fetch(`${baseUrl}/admin/sales-channels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        description: description,
        is_disabled: !enabled,
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Error en Medusa");

    // 6. Actualizar la Store con los IDs de Medusa
    await prisma.store.update({
      where: { id: newStore.id },
      data: {
        medusaSalesChannelId: data.sales_channel.id,
        // Si Medusa te da un Store ID específico, guárdalo aquí también
        // medusaStoreId: data.sales_channel.metadata?.store_id
      },
    });

    return { success: true, storeId: newStore.id };
  } catch (error) {
    // 7. Rollback: Si Medusa falla, eliminamos la tienda creada en Prisma
    // para no dejar datos inconsistentes (el usuario no pagó por una tienda que no funciona)
    await prisma.store.delete({ where: { id: newStore.id } });

    console.error("Error vinculando con Medusa:", error);
    throw new Error("Error al configurar la infraestructura de la tienda.");
  }
}
