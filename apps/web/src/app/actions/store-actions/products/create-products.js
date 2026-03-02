"use server";

import { getAdminToken } from "../../../../lib/get-admin-token";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../auth";

function parsePriceToCents(value) {
  if (value === null || value === undefined) return 0;

  const normalized = String(value).trim().replace(/\s/g, "").replace(",", ".");

  const num = Number.parseFloat(normalized);
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.round(num * 100);
}

export async function createMedusaProduct(formData, storeId) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { success: false, error: "No autenticado" };

  const userStore = await prisma.store.findFirst({
    where: {
      ownerId: userId,
      ...(storeId ? { id: storeId } : {}),
    },
    select: { id: true, medusaSalesChannelId: true },
  });

  if (!userStore?.medusaSalesChannelId) {
    return { success: false, error: "No tienes una tienda configurada" };
  }

  const token = await getAdminToken();
  const backendUrl = process.env.MEDUSA_BACKEND_URL;

  try {
    const productDataRaw = formData.get("productData");
    const productData = productDataRaw ? JSON.parse(productDataRaw) : {};
    const images = formData.getAll("images");

    // Preparar el payload según la estructura de Medusa v2
    const payload = {
      title: productData.title,
      description: productData.description || "",
      status: productData.status || "published",
      discountable: productData.discountable ?? true,
      // Vinculación al canal del usuario
      sales_channels: [{ id: userStore.medusaSalesChannelId }],
      // Shipping profile requerido por Medusa
      shipping_profile_id: "sp_01KEWKFBBTP3ZB2CD807DMQQET",
      // Opciones del producto
      options: productData.options || [
        { title: "Default", values: ["Default"] },
      ],
      // Variantes
      variants: productData.variants || [
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
    };

    if (Array.isArray(payload.variants)) {
      payload.variants = payload.variants.map((v) => {
        const prices = Array.isArray(v?.prices) ? v.prices : [];
        const normalizedPrices = prices
          .filter((p) => p && (p.amount !== undefined || p.value !== undefined))
          .map((p) => {
            const currency = (p.currency_code || p.currency || "usd")
              .toString()
              .toLowerCase();
            const amount =
              typeof p.amount === "number"
                ? p.amount
                : parsePriceToCents(p.amount ?? p.value);
            return {
              ...p,
              currency_code: currency,
              amount,
            };
          });

        return {
          ...v,
          prices: normalizedPrices,
        };
      });
    }

    // Agregar metadatos si existen
    if (
      productData.subtitle ||
      productData.handle ||
      productData.material ||
      productData.type ||
      productData.tags
    ) {
      payload.metadata = {};
      if (productData.subtitle)
        payload.metadata.subtitle = productData.subtitle;
      if (productData.handle) payload.metadata.handle = productData.handle;
      if (productData.material)
        payload.metadata.material = productData.material;
      if (productData.type) payload.metadata.type = productData.type;
      if (productData.tags) payload.metadata.tags = productData.tags;
    }

    const response = await fetch(`${backendUrl}/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error response from Medusa:", data);
      throw new Error(data.message || "Error al crear producto");
    }

    // Si hay imágenes, subirlas después de crear el producto
    if (images && images.length > 0) {
      console.log(`Processing ${images.length} images for upload...`);

      try {
        await uploadProductImages(data.product.id, images, token, backendUrl);
        console.log("All images uploaded successfully");
      } catch (imageError) {
        console.error("Error uploading images:", imageError);
        // No fallamos la creación del producto si las imágenes fallan
      }
    }

    return { success: true, data: data.product };
  } catch (error) {
    console.error("Error detallado:", error);
    return { success: false, error: error.message };
  }
}

async function uploadProductImages(productId, images, token, backendUrl) {
  console.log(
    `Starting upload of ${images.length} images for product ${productId}`,
  );

  const urls = [];

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    console.log(`Processing image ${i + 1}/${images.length}:`, {
      type: typeof image,
      isString: typeof image === "string",
      name:
        image && typeof image === "object" && "name" in image
          ? image.name
          : "N/A",
      size:
        image && typeof image === "object" && "size" in image
          ? image.size
          : "N/A",
    });

    const formData = new FormData();

    if (image && typeof image === "object") {
      formData.append("files", image);
      const name = "name" in image ? image.name : "image";
      const size = "size" in image ? image.size : "N/A";
      console.log(`Appending file-like object: ${name} (${size} bytes)`);
    } else if (typeof image === "string") {
      // Si es una URL string, convertirla a File primero
      try {
        console.log(`Fetching image from URL: ${image}`);
        const response = await fetch(image);
        const blob = await response.blob();
        const fileName = image.split("/").pop() || "image.jpg";
        const file = new File([blob], fileName, { type: blob.type });
        formData.append("files", file);
        console.log(
          `Successfully fetched and created file: ${fileName} (${blob.size} bytes)`,
        );
      } catch (error) {
        console.error("Error fetching image from URL:", error);
        continue; // Saltar esta imagen si no se puede obtener
      }
    } else {
      console.error("Invalid image format:", image);
      continue; // Saltar si no es File ni string
    }

    try {
      console.log(`Uploading to: ${backendUrl}/admin/uploads`);
      const response = await fetch(`${backendUrl}/admin/uploads`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Upload response error:", errorData);
        throw new Error(
          `Error uploading image: ${errorData.message || "Unknown error"}`,
        );
      }

      const result = await response.json();
      console.log(`Successfully uploaded image ${i + 1}:`, result);

      const maybeFiles =
        result?.files ||
        result?.uploads ||
        result?.data?.files ||
        result?.data?.uploads ||
        [];

      if (Array.isArray(maybeFiles) && maybeFiles.length > 0) {
        const u = maybeFiles[0]?.url;
        if (typeof u === "string" && u) urls.push(u);
      }
    } catch (uploadError) {
      console.error(`Failed to upload image ${i + 1}:`, uploadError);
      throw uploadError;
    }
  }

  if (urls.length === 0) return;

  try {
    const updateResponse = await fetch(
      `${backendUrl}/admin/products/${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          thumbnail: urls[0],
          images: urls.map((url) => ({ url })),
        }),
      },
    );

    const updateData = await updateResponse.json();
    if (!updateResponse.ok) {
      throw new Error(
        updateData?.message || "Error al asociar imágenes al producto",
      );
    }
  } catch (error) {
    console.error("Error updating product images:", error);
    throw error;
  }
}
