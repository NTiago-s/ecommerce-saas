import prisma from "../../../../lib/prisma";
import { getStripeClient } from "../../../../lib/stripe-client";

function mapStripeSubStatus(status) {
  const s = String(status ?? "").toLowerCase();
  if (s === "active" || s === "trialing") return "ACTIVE";
  if (s === "past_due" || s === "unpaid") return "PAST_DUE";
  if (s === "canceled") return "CANCELED";
  if (s === "incomplete" || s === "incomplete_expired") return "INCOMPLETE";
  return "INCOMPLETE";
}

export async function POST(req) {
  const secret = String(process.env.STRIPE_WEBHOOK_SECRET ?? "").trim();
  if (!secret) {
    // Stripe is hidden for now; don't fail deployments if not configured yet.
    return Response.json({ ok: true, disabled: true });
  }

  const stripe = getStripeClient();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return Response.json({ ok: false }, { status: 400 });

  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const subscriptionId = session?.metadata?.subscriptionId || session?.client_reference_id;
    const planId = session?.metadata?.planId;

    const stripeCustomerId = session?.customer ? String(session.customer) : null;
    const stripeSubscriptionId = session?.subscription
      ? String(session.subscription)
      : null;

    if (subscriptionId) {
      await prisma.subscription.updateMany({
        where: { id: String(subscriptionId) },
        data: {
          ...(planId ? { planId: String(planId) } : {}),
          ...(stripeCustomerId ? { stripeCustomerId } : {}),
          ...(stripeSubscriptionId ? { stripeSubscriptionId } : {}),
          status: "ACTIVE",
        },
      });
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    const stripeSubscriptionId = String(sub?.id ?? "").trim();
    if (stripeSubscriptionId) {
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId },
        data: { status: mapStripeSubStatus(sub?.status) },
      });
    }
  }

  return Response.json({ ok: true });
}

