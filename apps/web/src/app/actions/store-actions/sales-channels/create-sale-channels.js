"use server";

import { getAdminToken } from "../../../../lib/get-admin-token";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../auth"; // Tu configuración de Auth.js o Clerk/Lucia

export async function createSalesChannel({
  name,
  description,
  enabled,
  subdomain,
}) {
  // 1. Obtener el usuario de la sesión (nunca lo mandes desde el cliente por seguridad)
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Debes estar autenticado");

  // 2. Crear primero la tienda en tu base de datos Prisma
  // Esto asegura que el usuario es dueño de este registro.
  const newStore = await prisma.store.create({
    data: {
      name,
      subdomain,
      ownerId: userId, // Aquí queda relacionado con el usuario
    },
  });

  try {
    const token = await getAdminToken();
    const baseUrl = process.env.MEDUSA_BACKEND_URL;

    // 3. Crear el Sales Channel en Medusa
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

    // 4. Actualizar la Store en Prisma con el ID que nos dio Medusa
    await prisma.store.update({
      where: { id: newStore.id },
      data: {
        medusaSalesChannelId: data.sales_channel.id,
      },
    });

    return { success: true };
  } catch (error) {
    // Si Medusa falla, podrías querer borrar la Store creada o marcarla con error
    console.error(error);
    throw new Error("No se pudo vincular con Medusa");
  }
}
