import PricingCard from "./pricing-card";

export default function Pricing() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-center">
          Planes simples y transparentes
        </h2>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <PricingCard
            title="Free Trial"
            price="$0"
            features={["Acceso completo por 7 días"]}
          />

          <PricingCard
            highlight
            badge="Más elegido"
            title="Basic"
            price="$50"
            features={[
              "Hasta 1 tienda",
              "Carga de productos limitada (50)",
              "Soporte por email",
            ]}
          />

          <PricingCard
            title="Pro"
            price="$100"
            features={[
              "Hasta 5 tiendas",
              "Integraciones ilimitadas",
              "Soporte prioritario",
            ]}
          />
        </div>
      </div>
    </section>
  );
}
