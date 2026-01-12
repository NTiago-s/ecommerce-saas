const FEATURES = [
  {
    title: "Múltiples tiendas",
    description: "Gestiona varias tiendas desde una sola cuenta.",
  },
  {
    title: "Suscripciones flexibles",
    description: "Planes mensuales por tienda o upgrades automáticos.",
  },
  {
    title: "Pagos integrados",
    description: "Acepta pagos con tarjetas y pasarelas populares.",
  },
];

export default function Features() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-center">
          Todo lo que necesitas para vender online
        </h2>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {FEATURES.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
