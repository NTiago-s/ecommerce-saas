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
]

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-bold text-center">Empieza en minutos</h2>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {STEPS.map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                {item.step}
              </div>

              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>

              <p className="mt-2 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
