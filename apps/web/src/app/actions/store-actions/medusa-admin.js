// lib/medusa-admin.js en tu proyecto Next.js
"use server";

export async function createMedusaProduct(formData) {
  const adminToken = process.env.MEDUSA_ADMIN_TOKEN;
  const backendUrl = process.env.MEDUSA_BACKEND_URL;

  console.log("adminToken", adminToken);
  console.log("backendUrl", backendUrl);

  if (!adminToken) {
    throw new Error(
      "El token de Medusa no está definido en las variables de entorno",
    );
  }
  try {
    const response = await fetch(`${backendUrl}/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-medusa-access-token": adminToken,
        Authorization: `Bearer ${adminToken}`,
        Origin: "http://localhost:3000", // Formato correcto para v2
      },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        shipping_profile_id: "sp_01KEWKFBBTP3ZB2CD807DMQQET",
        options: [{ title: "Size", values: ["Default"] }],
        variants: [
          {
            title: "Original",
            sku: `sku-${Date.now()}`,
            prices: [
              {
                amount: Math.round(parseFloat(formData.price) * 100),
                currency_code: "usd",
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Unauthorized");

    return { success: true, data };
  } catch (error) {
    console.error("Error detallado:", error);
    return { success: false, error: error.message };
  }
}
