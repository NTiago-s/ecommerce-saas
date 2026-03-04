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
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Todo lo que necesitas para vender online
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Centralizá operaciones, automatizá suscripciones y mantené el
            control.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {FEATURES.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-3 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
