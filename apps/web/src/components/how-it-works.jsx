const STEPS = [
  {
    step: "01",
    title: "Elegis un plan",
    description:
      "Comparas opciones claras y te quedas con la que encaja con tu etapa.",
  },
  {
    step: "02",
    title: "Creas tu cuenta",
    description:
      "Registras tu negocio y dejas lista la base para empezar a operar.",
  },
  {
    step: "03",
    title: "Lanzas tu tienda",
    description:
      "La cuenta queda preparada para que tu ecommerce empiece a vender.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="how-it-works-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <h2
            id="how-it-works-title"
            className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
          >
            Tres pasos para poner tu ecommerce en marcha
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            El recorrido elimina friccion y lleva a la accion principal: elegir
            un plan y arrancar.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {STEPS.map((item) => (
            <article key={item.step} className="surface p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                {item.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-950">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
