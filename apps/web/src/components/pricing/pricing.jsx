import PricingCard from "./pricing-card";

import { getPublicPlans } from "../../app/actions/public-actions/plans";

export default async function Pricing() {
  const plans = await getPublicPlans();

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-center">
          Planes simples y transparentes
        </h2>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              title={plan.name}
              currency={plan.currency}
              price={plan.price}
              features={plan.features}
              highlight={index === 1}
              badge={index === 1 ? "Más elegido" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
