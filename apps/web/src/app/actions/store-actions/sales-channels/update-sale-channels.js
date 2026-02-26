"use server";

import { getAdminToken } from "../../../../lib/get-admin-token";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../auth";

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL;

export async function updateSalesChannel({ channelId, name, description }) {
  // 1. Obtener el usuario logueado
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("No autorizado");
  }

  // 2. Verificar que el canal pertenece al usuario
  const userStore = await prisma.store.findFirst({
    where: {
      ownerId: userId,
      medusaSalesChannelId: channelId,
    },
  });

  if (!userStore) {
    throw new Error("No tienes permiso para editar esta tienda");
  }

  // 3. Obtener el token de Medusa
  const token = await getAdminToken();

  // 4. Actualizar el sales channel en Medusa
  const res = await fetch(`${MEDUSA_URL}/admin/sales-channels/${channelId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      description,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Error actualizando la tienda");
  }

  const data = await res.json();
  return data.sales_channel;
}
