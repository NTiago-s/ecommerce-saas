import PricingCard from "./PricingCard";

export default function Pricing() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-center">
          Planes simples y transparentes
        </h2>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <PricingCard
            title="Starter"
            price="$10"
            features={["1 tienda", "Productos ilimitados", "Soporte básico"]}
          />

          <PricingCard
            highlight
            title="Pro"
            price="$25"
            features={[
              "Hasta 3 tiendas",
              "Suscripciones",
              "Soporte prioritario",
            ]}
          />

          <PricingCard
            title="Enterprise"
            price="Custom"
            features={[
              "Tiendas ilimitadas",
              "Integraciones avanzadas",
              "Soporte dedicado",
            ]}
          />
        </div>
      </div>
    </section>
  );
}
