const FEATURES = [
  {
    title: "Múltiples tiendas",
    description: "Gestiona varias tiendas desde una sola cuenta.",
    icon: "🏪",
  },
  {
    title: "Suscripciones flexibles",
    description: "Planes mensuales por tienda o upgrades automáticos.",
    icon: "📈",
  },
  {
    title: "Pagos integrados",
    description: "Acepta pagos con tarjetas y pasarelas populares.",
    icon: "💳",
  },
];

export default function Features() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="features-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="features-title"
            className="text-3xl font-bold tracking-tight text-gray-900"
          >
            Todo lo que necesitas para vender online
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Centralizá operaciones, automatizá suscripciones y mantené el
            control.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3" role="list">
          {FEATURES.map((item, i) => (
            <article
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
              role="listitem"
              aria-label={`Característica: ${item.title}`}
            >
              <div className="text-3xl mb-4" aria-hidden="true">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-3 text-gray-600">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
