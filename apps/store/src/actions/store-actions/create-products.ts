"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createMedusaProduct(data: any) {
  const backendUrl = process.env.MEDUSA_BACKEND_URL;
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  // Determinamos el título de la opción y su valor
  const optionTitle = "Size";
  const optionValue = data.v_title || "Default";

  const payload: any = {
    title: data.title,
    subtitle: data.subtitle || "",
    handle: data.handle || undefined,
    description: data.description || "",
    discountable: data.discountable === "true",
    status: "published",
    // SOLUCIÓN AL ERROR 1: Definir los values de la opción
    options: [
      { 
        title: optionTitle, 
        values: [optionValue] // Medusa requiere los valores posibles aquí
      }
    ],
    variants: [
      {
        title: optionValue,
        sku: data.v_sku || undefined,
        // SOLUCIÓN AL ERROR 2: 'inventory_quantity' no existe aquí. 
        // Se debe usar 'manage_inventory' y luego actualizar stock por separado 
        // o usar el campo 'inventory_items' si el módulo está activo.
        manage_inventory: true, 
        prices: [
          {
            amount: Math.round(parseFloat(data.price || "0") * 100),
            currency_code: "usd",
          }
        ],
        // Mapeo exacto de la opción creada arriba
        options: {
          [optionTitle]: optionValue
        }
      },
    ],
    type: data.type ? { value: data.type } : undefined,
    collection_id: data.collection || undefined,
  };

  try {
    const response = await fetch(`${backendUrl}/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Detalle del error:", JSON.stringify(result, null, 2));
      return { 
        success: false, 
        error: result.message || "Error en el esquema de Medusa" 
      };
    }

    revalidatePath("/admin/products");
    return { success: true, data: result.product };
  } catch (error) {
    return { success: false, error: "Error de conexión" };
  }
}