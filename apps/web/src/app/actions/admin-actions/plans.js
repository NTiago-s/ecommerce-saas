"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import prisma from "../../../lib/prisma";
import { auth } from "../../../auth";
import {
  calculateMercadoPagoArsAmount,
  getOfficialUsdArsRate,
} from "../../../lib/bcra-official-fx";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return session.user.id;
}

function parseOptionalInt(value) {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  if (!str) return null;
  const parsed = Number.parseInt(str, 10);
  if (Number.isNaN(parsed)) {
    throw new Error("Valor numérico inválido");
  }
  return parsed;
}

function parseRequiredInt(value) {
  const parsed = parseOptionalInt(value);
  if (parsed === null) {
    throw new Error("Campo numérico requerido");
  }
  return parsed;
}

function parseFeatures(value) {
  const str = String(value ?? "").trim();
  if (!str) return {};

  try {
    const parsed = JSON.parse(str);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Features debe ser un JSON objeto");
    }
    return parsed;
  } catch {
    throw new Error("Features debe ser JSON válido");
  }
}

export async function createPlan(formData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const currency = String(formData.get("currency") ?? "").trim() || "usd";
  const stripePriceIdRaw = String(formData.get("stripePriceId") ?? "").trim();
  const stripePriceId = stripePriceIdRaw ? stripePriceIdRaw : null;

  if (!name) throw new Error("El nombre es obligatorio");

  const price = parseRequiredInt(formData.get("price"));
  const maxStores = parseOptionalInt(formData.get("maxStores"));
  const maxProducts = parseOptionalInt(formData.get("maxProducts"));
  const maxOrders = parseOptionalInt(formData.get("maxOrders"));
  const maxStaff = parseOptionalInt(formData.get("maxStaff"));
  const features = parseFeatures(formData.get("features"));

  await prisma.plan.create({
    data: {
      name,
      price,
      currency,
      stripePriceId,
      maxStores,
      maxProducts,
      maxOrders,
      maxStaff,
      features,
    },
  });

  revalidatePath("/admin/plans");
}

export async function updatePlan(planId, formData) {
  await requireAdmin();

  const id = String(planId ?? "").trim();
  if (!id) throw new Error("Plan inválido");

  const name = String(formData.get("name") ?? "").trim();
  const currency = String(formData.get("currency") ?? "").trim() || "usd";
  const stripePriceIdRaw = String(formData.get("stripePriceId") ?? "").trim();
  const stripePriceId = stripePriceIdRaw ? stripePriceIdRaw : null;

  if (!name) throw new Error("El nombre es obligatorio");

  const price = parseRequiredInt(formData.get("price"));
  const maxStores = parseOptionalInt(formData.get("maxStores"));
  const maxProducts = parseOptionalInt(formData.get("maxProducts"));
  const maxOrders = parseOptionalInt(formData.get("maxOrders"));
  const maxStaff = parseOptionalInt(formData.get("maxStaff"));
  const features = parseFeatures(formData.get("features"));

  await prisma.plan.update({
    where: { id },
    data: {
      name,
      price,
      currency,
      stripePriceId,
      maxStores,
      maxProducts,
      maxOrders,
      maxStaff,
      features,
    },
  });

  revalidatePath("/admin/plans");
}

export async function deletePlan(planId) {
  await requireAdmin();

  const id = String(planId ?? "").trim();
  if (!id) throw new Error("Plan inválido");

  await prisma.plan.delete({
    where: { id },
  });

  revalidatePath("/admin/plans");
}

export async function syncMercadoPagoPlan(planId) {
  await requireAdmin();

  const id = String(planId ?? "").trim();
  if (!id) throw new Error("Plan invalido");

  const plan = await prisma.plan.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      price: true,
      currency: true,
      mpLastArsAmount: true,
    },
  });

  if (!plan) throw new Error("Plan no encontrado");
  if (Number(plan.price) <= 0) throw new Error("Solo aplica a planes pagos");
  if (String(plan.currency ?? "").toLowerCase() !== "usd") {
    throw new Error("Este flujo asume pricing en USD");
  }

  const fx = await getOfficialUsdArsRate();
  const amountArs = calculateMercadoPagoArsAmount({
    usdAmount: plan.price,
    exchangeRate: fx.value,
  });

  await prisma.plan.update({
    where: { id: plan.id },
    data: {
      mpLastArsAmount: amountArs,
      mpLastFxAt: fx.date ?? new Date(),
    },
  });

  revalidatePath("/admin/plans");
}
