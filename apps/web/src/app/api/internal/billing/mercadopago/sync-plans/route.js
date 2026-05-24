import prisma from "../../../../../../lib/prisma";
import {
  calculateMercadoPagoArsAmount,
  getOfficialUsdArsRate,
} from "../../../../../../lib/bcra-official-fx";

function requireInternalAuth(req) {
  const expected = String(process.env.SAAS_INTERNAL_API_KEY ?? "").trim();
  if (!expected) throw new Error("SAAS_INTERNAL_API_KEY no configurado");

  const auth = String(req.headers.get("authorization") ?? "").trim();
  const token = auth.toLowerCase().startsWith("bearer ")
    ? auth.slice("bearer ".length).trim()
    : "";

  if (!token || token !== expected) {
    return false;
  }
  return true;
}

export async function POST(req) {
  if (!requireInternalAuth(req)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  // Subscriptions now use "pending" checkout without associated plans.
  // We keep this endpoint alive for compatibility with the Medusa scheduled job.
  const fx = await getOfficialUsdArsRate();

  const plans = await prisma.plan.findMany({
    where: {
      currency: "usd",
      price: { gt: 0 },
    },
    select: {
      id: true,
      name: true,
      price: true,
      mpPreapprovalPlanId: true,
    },
    orderBy: { createdAt: "asc" },
  });

  for (const plan of plans) {
    const nextAmountArs = calculateMercadoPagoArsAmount({
      usdAmount: plan.price,
      exchangeRate: fx.value,
    });

    await prisma.plan.update({
      where: { id: plan.id },
      data: {
        mpLastArsAmount: nextAmountArs,
        mpLastFxAt: fx.date ?? new Date(),
      },
    });
  }

  return Response.json({
    ok: true,
    mode: "pending-without-associated-plan",
    fx: {
      value: fx.value,
      date: fx.date ? fx.date.toISOString() : null,
    },
    plans: {
      total: plans.length,
      updated: plans.length,
    },
  });
}
