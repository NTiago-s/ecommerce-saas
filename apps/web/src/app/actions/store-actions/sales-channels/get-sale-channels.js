"use server";

import { getAdminToken } from "../../../../lib/get-admin-token";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../auth";

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL;

export async function getSalesChannels() {
  // 1. Obtener el usuario logueado
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("No autorizado");
  }

  // 2. Consultar en Prisma los IDs de Medusa que le pertenecen a este usuario
  const userStores = await prisma.store.findMany({
    where: {
      ownerId: userId,
    },
    select: {
      medusaSalesChannelId: true,
    },
  });

  // Creamos un array de IDs (ej: ["sc_01", "sc_02"])
  const allowedIds = userStores
    .map((s) => s.medusaSalesChannelId)
    .filter(Boolean); // Eliminamos nulos si los hay

  if (allowedIds.length === 0) return [];

  // 3. Obtener el token de Medusa
  const token = await getAdminToken();

  // 4. Pedir los canales a Medusa
  const res = await fetch(`${MEDUSA_URL}/admin/sales-channels`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Error obteniendo sales channels");

  const data = await res.json();

  // 5. FILTRADO CRÍTICO: Solo devolver los que están en Prisma para este usuario
  const filteredChannels = data.sales_channels.filter((channel) =>
    allowedIds.includes(channel.id),
  );

  return filteredChannels;
}
