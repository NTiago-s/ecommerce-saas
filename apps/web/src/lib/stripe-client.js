import Stripe from "stripe";

export function getStripeClient() {
  const key = String(process.env.STRIPE_SECRET_KEY ?? "").trim();
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY no configurado");
  }

  return new Stripe(key, {
    apiVersion: "2024-06-20",
    typescript: false,
  });
}

