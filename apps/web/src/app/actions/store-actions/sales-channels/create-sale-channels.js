"use server";

import { callSaasApi } from "../../../../lib/saas-api";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../auth";

function normalizeStoreSlug(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

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

  const normalizedSubdomain = normalizeStoreSlug(subdomain);

  if (!String(name ?? "").trim()) {
    throw new Error("Debes ingresar un nombre para la tienda.");
  }

  if (!normalizedSubdomain || normalizedSubdomain.length < 3) {
    throw new Error("El slug de la tienda debe tener al menos 3 caracteres.");
  }

  // 3. VERIFICAR LÍMITE DE TIENDAS (maxStores)
  if (
    subscription.plan.maxStores &&
    subscription._count.stores >= subscription.plan.maxStores
  ) {
    throw new Error(
      `Tu plan ${subscription.plan.name} solo permite ${subscription.plan.maxStores} tienda(s).`,
    );
  }

  const existingStore = await prisma.store.findUnique({
    where: { subdomain: normalizedSubdomain },
    select: { id: true },
  });

  if (existingStore) {
    throw new Error("Ese slug ya está en uso. Elige otro para tu tienda.");
  }

  // 4. Crear la tienda en Prisma incluyendo el subscriptionId
  // Nota: Tu schema exige subscriptionId, si no lo pones aquí, Prisma dará error.
  const newStore = await prisma.store.create({
    data: {
      name: String(name).trim(),
      subdomain: normalizedSubdomain,
      ownerId: userId,
      subscriptionId: subscription.id, // Vínculo obligatorio según tu schema
    },
  });

  try {
    const data = await callSaasApi("/saas/sales-channels", {
      method: "POST",
      body: JSON.stringify({
        name: String(name).trim(),
        description,
        is_disabled: !enabled,
        metadata: {
          saas_store_id: newStore.id,
          saas_owner_id: userId,
          subdomain: normalizedSubdomain,
        },
      }),
    });

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
