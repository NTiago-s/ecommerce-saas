"use server";

import { auth } from "../../../../auth";
import { prisma } from "../../../../lib/prisma";
import { callSaasApi, salesChannelHeader } from "../../../../lib/saas-api";

export async function getSalesChannels() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("No autorizado");
  }

  const userStores = await prisma.store.findMany({
    where: { ownerId: userId },
    select: { medusaSalesChannelId: true },
  });

  const allowedIds = userStores
    .map((store) => store.medusaSalesChannelId)
    .filter(Boolean);

  if (!allowedIds.length) return [];

  const data = await callSaasApi("/saas/sales-channels", {
    method: "GET",
    headers: salesChannelHeader(allowedIds),
  });

  return data.sales_channels || [];
}
