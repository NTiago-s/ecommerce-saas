import prisma from "../../../../../lib/prisma";
import { callSaasApi, salesChannelHeader } from "../../../../../lib/saas-api";
import {
  buildStorefrontPath,
  buildStorefrontUrl,
} from "../../../../../lib/storefront-url";

async function getSalesChannel(channelId) {
  if (!channelId) return null;

  try {
    const data = await callSaasApi(`/saas/sales-channels/${channelId}`, {
      method: "GET",
      headers: salesChannelHeader([channelId]),
    });

    return data.sales_channel || null;
  } catch (error) {
    console.error("Error fetching public storefront sales channel:", error);
    return null;
  }
}

export async function GET(_req, context) {
  const slug = String((await context.params)?.slug ?? "")
    .trim()
    .toLowerCase();

  if (!slug) {
    return Response.json({ message: "Slug invalido" }, { status: 400 });
  }

  const store = await prisma.store.findUnique({
    where: { subdomain: slug },
    select: {
      id: true,
      name: true,
      subdomain: true,
      status: true,
      medusaSalesChannelId: true,
      createdAt: true,
    },
  });

  if (!store || store.status !== "ACTIVE" || !store.medusaSalesChannelId) {
    return Response.json({ message: "Store not found" }, { status: 404 });
  }

  const salesChannel = await getSalesChannel(store.medusaSalesChannelId);

  if (!salesChannel || salesChannel.is_disabled) {
    return Response.json({ message: "Store not available" }, { status: 404 });
  }

  return Response.json({
    store: {
      id: store.id,
      name: store.name,
      slug: store.subdomain,
      status: store.status,
      description: salesChannel.description || "",
      salesChannelId: store.medusaSalesChannelId,
      createdAt: store.createdAt,
      path: buildStorefrontPath(store.subdomain),
      url: buildStorefrontUrl(store.subdomain),
    },
  });
}
