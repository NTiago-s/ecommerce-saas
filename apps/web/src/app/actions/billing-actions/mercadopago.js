"use server";

import { redirect } from "next/navigation";
import prisma from "../../../lib/prisma";
import { auth } from "../../../auth";
import {
  calculateMercadoPagoArsAmount,
  getOfficialUsdArsRate,
} from "../../../lib/bcra-official-fx";
import {
  mpCreatePreapproval,
} from "../../../lib/mercadopago";

function siteUrl() {
  return (
    String(process.env.NEXT_PUBLIC_SITE_URL ?? "").trim() ||
    String(process.env.NEXTAUTH_URL ?? "").trim() ||
    "http://localhost:3000"
  );
}

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user;
}

async function ensureUserSubscription(userId) {
  const existing = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (existing) return existing;

  return prisma.subscription.create({
    data: {
      userId,
      status: "INCOMPLETE",
    },
  });
}

async function getRecurringConfig(plan) {
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

  return {
    frequency: 1,
    frequency_type: "months",
    transaction_amount: amountArs,
    currency_id: "ARS",
  };
}

export async function startMercadoPagoSubscription(planId) {
  const user = await requireUser();

  const plan = await prisma.plan.findUnique({
    where: { id: String(planId ?? "").trim() },
    select: {
      id: true,
      name: true,
      price: true,
      currency: true,
    },
  });

  if (!plan) throw new Error("Plan no encontrado");

  const subscription = await ensureUserSubscription(user.id);

  // Free plan: no Mercado Pago flow.
  if (Number(plan.price) === 0) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        planId: plan.id,
        status: "ACTIVE",
        mpPreapprovalId: null,
        mpPayerId: null,
      },
    });
    return { ok: true, redirectTo: "/dashboard" };
  }

  if (String(plan.currency ?? "").toLowerCase() !== "usd") {
    throw new Error("Este flujo asume pricing en USD");
  }

  const autoRecurring = await getRecurringConfig(plan);

  const notificationUrl =
    String(process.env.MERCADOPAGO_NOTIFICATION_URL ?? "").trim() || null;

  const preapproval = await mpCreatePreapproval({
    reason: `${plan.name} (mensual)`,
    payer_email: user.email,
    auto_recurring: autoRecurring,
    back_url: `${siteUrl()}/dashboard`,
    notification_url: notificationUrl,
    external_reference: `sub_${subscription.id}`,
    status: "pending",
  });

  const preapprovalId = String(preapproval?.id ?? "").trim();
  const initPoint = String(preapproval?.init_point ?? "").trim();

  if (!preapprovalId || !initPoint) {
    throw new Error("Mercado Pago no devolvio init_point/id");
  }

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      planId: plan.id,
      status: "INCOMPLETE",
      mpPreapprovalId: preapprovalId,
    },
  });

  return { ok: true, initPoint };
}
