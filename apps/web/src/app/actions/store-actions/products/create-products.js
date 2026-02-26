"use server";

import { getAdminToken } from "../../../../lib/get-admin-token";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../auth";

export async function createMedusaProduct(productData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { success: false, error: "No autenticado" };

  const userStore = await prisma.store.findFirst({
    where: { ownerId: userId },
    select: { medusaSalesChannelId: true },
  });

  if (!userStore?.medusaSalesChannelId) {
    return { success: false, error: "No tienes una tienda configurada" };
  }

  const token = await getAdminToken();
  const backendUrl = process.env.MEDUSA_BACKEND_URL;

  try {
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
              amount: Math.round(parseFloat(productData.price || 0) * 100),
              currency_code: "usd",
            },
          ],
        },
      ],
    };

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
    if (productData.images && productData.images.length > 0) {
      console.log(
        `Processing ${productData.images.length} images for upload...`,
      );

      // Verificar que el endpoint de upload esté disponible
      try {
        const testResponse = await fetch(`${backendUrl}/admin/uploads`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });

        if (testResponse.status === 404) {
          console.warn("Upload endpoint not found, using alternative endpoint");
        }
      } catch (testError) {
        console.log(
          "Upload endpoint test failed, continuing with upload attempt",
        );
      }

      try {
        await uploadProductImages(
          data.product.id,
          productData.images,
          token,
          backendUrl,
        );
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

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    console.log(`Processing image ${i + 1}/${images.length}:`, {
      type: typeof image,
      isFile: image instanceof File,
      isString: typeof image === "string",
      name: image instanceof File ? image.name : "N/A",
      size: image instanceof File ? image.size : "N/A",
    });

    const formData = new FormData();

    if (image instanceof File) {
      // Si es un File object, agregarlo directamente
      formData.append("files", image);
      console.log(`Appending File object: ${image.name} (${image.size} bytes)`);
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
      console.log(
        `Uploading to: ${backendUrl}/admin/products/${productId}/uploads`,
      );
      const response = await fetch(
        `${backendUrl}/admin/products/${productId}/uploads`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Upload response error:", errorData);
        throw new Error(
          `Error uploading image: ${errorData.message || "Unknown error"}`,
        );
      }

      const result = await response.json();
      console.log(`Successfully uploaded image ${i + 1}:`, result);
    } catch (uploadError) {
      console.error(`Failed to upload image ${i + 1}:`, uploadError);
      throw uploadError;
    }
  }
}
