"use server";

import { redirect } from "next/navigation";
import prisma from "../../../lib/prisma";
import { auth } from "../../../auth";
import { getStripeClient } from "../../../lib/stripe-client";

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
    data: { userId, status: "INCOMPLETE" },
  });
}

export async function startStripeSubscription(planId) {
  // Stripe is intentionally hidden in UI for now. This action is kept ready.
  const user = await requireUser();
  const stripe = getStripeClient();

  const plan = await prisma.plan.findUnique({
    where: { id: String(planId ?? "").trim() },
    select: { id: true, name: true, stripePriceId: true, price: true },
  });
  if (!plan) throw new Error("Plan no encontrado");
  if (!plan.stripePriceId) {
    throw new Error("El plan no tiene stripePriceId configurado");
  }
  if (Number(plan.price) <= 0) {
    throw new Error("Stripe solo aplica a planes pagos");
  }

  const subscription = await ensureUserSubscription(user.id);

  // Ensure customer exists in Stripe
  let customerId = subscription.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: `${siteUrl()}/dashboard?stripe=success`,
    cancel_url: `${siteUrl()}/dashboard?stripe=cancel`,
    client_reference_id: subscription.id,
    metadata: {
      subscriptionId: subscription.id,
      planId: plan.id,
      userId: user.id,
    },
  });

  if (!session.url) throw new Error("Stripe no devolvio URL de checkout");

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      planId: plan.id,
      status: "INCOMPLETE",
    },
  });

  return { ok: true, url: session.url };
}
