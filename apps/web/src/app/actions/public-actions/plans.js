"use server";

import prisma from "../../../lib/prisma";

export async function getPublicPlans() {
  const validPlanNames = ["Prueba", "Basico", "Intermedio", "Profesional"];

  const plans = await prisma.plan.findMany({
    where: {
      name: { in: validPlanNames },
    },
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

  const order = {
    Prueba: 0,
    Basico: 1,
    Intermedio: 2,
    Profesional: 3,
  };

  return plans.sort((a, b) => (order[a.name] ?? 99) - (order[b.name] ?? 99));
}
