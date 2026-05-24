"use server";

import { auth } from "../../../../auth";
import { prisma } from "../../../../lib/prisma";
import { callSaasApi, salesChannelHeader } from "../../../../lib/saas-api";
import {
  getPrimarySubscription,
  hasStoreAccess,
} from "../../../../lib/subscriptions";

function parsePriceToCents(value) {
  if (value === null || value === undefined) return 0;

  const normalized = String(value).trim().replace(/\s/g, "").replace(",", ".");
  const num = Number.parseFloat(normalized);

  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.round(num * 100);
}

function normalizeVariantPrices(variants = []) {
  return variants.map((variant) => {
    const prices = Array.isArray(variant?.prices) ? variant.prices : [];

    return {
      ...variant,
      prices: prices
        .filter((price) => price && (price.amount !== undefined || price.value !== undefined))
        .map((price) => ({
          ...price,
          currency_code: (price.currency_code || price.currency || "usd")
            .toString()
            .toLowerCase(),
          amount:
            typeof price.amount === "number"
              ? price.amount
              : parsePriceToCents(price.amount ?? price.value),
        })),
    };
  });
}

function selectedSalesChannelIds(productData) {
  return (productData.sales_channels || [])
    .map((channel) => (typeof channel === "string" ? channel : channel?.id))
    .filter(Boolean);
}

async function getAllowedSalesChannelIds(userId) {
  const stores = await prisma.store.findMany({
    where: { ownerId: userId },
    select: { medusaSalesChannelId: true },
  });

  return stores.map((store) => store.medusaSalesChannelId).filter(Boolean);
}

async function getSubscriptionWithPlan(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptions: {
        include: { plan: true },
      },
    },
  });

  return getPrimarySubscription(user?.subscriptions ?? []);
}

async function assertProductPlanLimits({
  userId,
  selectedSalesChannels,
  allowedSalesChannelIds,
}) {
  const subscription = await getSubscriptionWithPlan(userId);

  if (!hasStoreAccess(subscription)) {
    throw new Error("Necesitas un plan activo para crear productos.");
  }

  const maxProducts = subscription?.plan?.maxProducts;

  if (!maxProducts) {
    return;
  }

  const query = new URLSearchParams();
  selectedSalesChannels.forEach((id) => query.append("sales_channel_id", id));

  const data = await callSaasApi(`/saas/products?${query.toString()}`, {
    method: "GET",
    headers: salesChannelHeader(allowedSalesChannelIds),
  });

  const products = data.products || [];

  for (const salesChannelId of selectedSalesChannels) {
    const productCount = products.filter((product) =>
      (product.sales_channels || []).some((channel) => channel.id === salesChannelId),
    ).length;

    if (productCount >= maxProducts) {
      throw new Error(
        `Tu plan ${subscription.plan.name} permite hasta ${maxProducts} productos por tienda.`,
      );
    }
  }
}

async function getDefaultShippingProfileId() {
  const data = await callSaasApi("/saas/shipping-profiles", { method: "GET" });
  const profile =
    data.shipping_profiles?.find((item) => item.type === "default") ||
    data.shipping_profiles?.[0];

  return profile?.id || null;
}

async function uploadImages(images, allowedSalesChannelIds) {
  if (!images?.length) return [];

  const formData = new FormData();

  for (const image of images) {
    if (image && typeof image === "object") {
      formData.append("files", image);
    }
  }

  const data = await callSaasApi("/saas/uploads", {
    method: "POST",
    headers: salesChannelHeader(allowedSalesChannelIds),
    body: formData,
  });

  return data.files?.map((file) => file.url).filter(Boolean) || [];
}

export async function createMedusaProduct(formData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { success: false, error: "No autenticado" };

  try {
    const productDataRaw = formData.get("productData");
    const productData = productDataRaw ? JSON.parse(productDataRaw) : {};
    const images = formData.getAll("images");
    const salesChannels = selectedSalesChannelIds(productData);

    if (!salesChannels.length) {
      return { success: false, error: "Debes seleccionar al menos una tienda" };
    }

    const allowedSalesChannelIds = await getAllowedSalesChannelIds(userId);
    const allowed = new Set(allowedSalesChannelIds);

    if (!salesChannels.every((id) => allowed.has(id))) {
      return {
        success: false,
        error: "No tienes permiso para publicar en una de las tiendas elegidas",
      };
    }

    await assertProductPlanLimits({
      userId,
      selectedSalesChannels: salesChannels,
      allowedSalesChannelIds,
    });

    const shippingProfileId =
      productData.shipping_profile_id || (await getDefaultShippingProfileId());

    if (!shippingProfileId) {
      return {
        success: false,
        error: "No hay un perfil de envío configurado en Medusa",
      };
    }

    const imageUrls = await uploadImages(images, allowedSalesChannelIds);

    const payload = {
      title: productData.title,
      description: productData.description || "",
      status: productData.status || "published",
      discountable: productData.discountable ?? true,
      sales_channels: salesChannels.map((id) => ({ id })),
      shipping_profile_id: shippingProfileId,
      options: productData.options || [
        { title: "Default", values: ["Default"] },
      ],
      variants: normalizeVariantPrices(
        productData.variants || [
          {
            title: productData.title || "Default Variant",
            sku: `sku-${Date.now()}`,
            manage_inventory: true,
            allow_backorder: false,
            prices: [
              {
                amount: parsePriceToCents(productData.price || 0),
                currency_code: "usd",
              },
            ],
          },
        ],
      ),
      thumbnail: imageUrls[0],
      images: imageUrls.map((url) => ({ url })),
    };

    const metadata = {};
    if (productData.subtitle) metadata.subtitle = productData.subtitle;
    if (productData.handle) metadata.handle = productData.handle;
    if (productData.material) metadata.material = productData.material;
    if (productData.type) metadata.type = productData.type;
    if (productData.tags) metadata.tags = productData.tags;
    if (Object.keys(metadata).length) payload.metadata = metadata;

    const data = await callSaasApi("/saas/products", {
      method: "POST",
      headers: salesChannelHeader(allowedSalesChannelIds),
      body: JSON.stringify(payload),
    });

    return { success: true, data: data.product };
  } catch (error) {
    console.error("Error creando producto:", error);
    return { success: false, error: error.message };
  }
}
