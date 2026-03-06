import PricingCard from "./pricing-card";

import { getPublicPlans } from "../../app/actions/public-actions/plans";

export default async function Pricing() {
  const plans = await getPublicPlans();

  return (
    <section className="py-20" aria-labelledby="pricing-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 id="pricing-title" className="text-3xl font-bold text-gray-900">
            Planes simples y transparentes
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Elige el plan perfecto para tu negocio con precios claros y sin
            sorpresas.
          </p>
        </div>

        <div
          className="mt-12 grid md:grid-cols-3 gap-8"
          role="list"
          aria-label="Planes de precios disponibles"
        >
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              title={plan.name}
              currency={plan.currency}
              price={plan.price}
              features={plan.features}
              highlight={index === 1}
              badge={index === 1 ? "Más elegido" : undefined}
              aria-label={`Plan ${plan.name}: ${plan.currency} ${plan.price} por mes`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
