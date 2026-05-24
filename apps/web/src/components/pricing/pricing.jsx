import PricingCard from "./pricing-card";
import { getPublicPlans } from "../../app/actions/public-actions/plans";

export default async function Pricing() {
  const plans = await getPublicPlans();
  const highlightedPlan = "Intermedio";

  return (
    <section className="py-16 sm:py-20" aria-labelledby="pricing-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
            Planes
          </span>
          <h2
            id="pricing-title"
            className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
          >
            Elegi el plan que mejor encaja con tu tienda.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Un solo plan por cuenta, precios claros y una estructura pensada para
            ayudarte a lanzar tu ecommerce sin perder tiempo.
          </p>
        </div>

        <div
          className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          role="list"
          aria-label="Planes de precios disponibles"
        >
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              planId={plan.id}
              title={plan.name}
              currency={plan.currency}
              price={plan.price}
              features={plan.features}
              maxStores={plan.maxStores}
              maxProducts={plan.maxProducts}
              highlight={plan.name === highlightedPlan}
              badge={plan.name === highlightedPlan ? "Mas elegido" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
