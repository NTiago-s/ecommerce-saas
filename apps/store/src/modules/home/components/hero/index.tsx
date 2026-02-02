import Button from "ui/button"

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="mx-auto max-w-7xl px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Crea y gestiona tus tiendas online
            <span className="block text-blue-200">desde un solo lugar</span>
          </h1>

          <p className="mt-6 text-lg text-emerald-100">
            Administra múltiples tiendas, planes de suscripción y pagos con una
            plataforma simple y escalable.
          </p>

          <div className="mt-8 flex gap-4">
            <Button variant="light" size="lg">
              Empezar ahora
            </Button>

            <Button variant="secondary" size="lg">
              Ver demo
            </Button>
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 backdrop-blur p-6 shadow-xl">
          <div className="h-64 rounded-xl bg-blue-900/40 flex items-center justify-center">
            <span className="text-blue-200">Preview del dashboard</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
