"use server";

import prisma from "../../../lib/prisma";

export async function getPublicPlans() {
  const plans = await prisma.plan.findMany({
    orderBy: { price: "asc" },
    select: {
      id: true,
      name: true,
      price: true,
      currency: true,
      stripePriceId: true,
      maxStores: true,
      maxProducts: true,
      maxOrders: true,
      maxStaff: true,
      features: true,
    },
  });

  return plans;
}
