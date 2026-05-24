"use server";

import { auth } from "../../../../auth";
import { prisma } from "../../../../lib/prisma";
import { callSaasApi, salesChannelHeader } from "../../../../lib/saas-api";

export async function toggleSalesChannelStatus({ channelId, isDisabled }) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("No autorizado");
  }

  const userStore = await prisma.store.findFirst({
    where: {
      ownerId: userId,
      medusaSalesChannelId: channelId,
    },
    select: { id: true, medusaSalesChannelId: true },
  });

  if (!userStore?.medusaSalesChannelId) {
    throw new Error("No tienes permiso para modificar esta tienda");
  }

  const data = await callSaasApi(`/saas/sales-channels/${channelId}`, {
    method: "POST",
    headers: salesChannelHeader([userStore.medusaSalesChannelId]),
    body: JSON.stringify({ is_disabled: isDisabled }),
  });

  await prisma.store.update({
    where: { id: userStore.id },
    data: {
      status: isDisabled ? "INACTIVE" : "ACTIVE",
    },
  });

  return data.sales_channel;
}
