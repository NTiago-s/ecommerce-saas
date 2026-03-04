const STEPS = [
  {
    step: "1",
    title: "Crea tu cuenta",
    description: "Regístrate y accede al panel.",
  },
  {
    step: "2",
    title: "Activa tu tienda",
    description: "Elige un plan y configura tu tienda.",
  },
  {
    step: "3",
    title: "Empieza a vender",
    description: "Publica productos y cobra pagos.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Empieza en minutos
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Un flujo simple para activar tu tienda y empezar a vender.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                {item.step}
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {item.title}
              </h3>

              <p className="mt-2 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
