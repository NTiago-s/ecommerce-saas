import Button from "../ui/button";

export default function Hero() {
  return (
    <section className="bg-linear-to-br from-blue-600 to-blue-800 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-blue-100 ring-1 ring-white/15">
            Ecommerce SaaS
          </p>

          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Crea y gestiona tus tiendas online
            <span className="block text-blue-200">desde un solo lugar</span>
          </h1>

          <p className="mt-6 text-lg text-blue-100">
            Administra múltiples tiendas, planes de suscripción y pagos con una
            plataforma simple y escalable.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
            <Button variant="light" size="lg" href="/register">
              Empezar ahora
            </Button>

            <Button variant="secondary" size="lg" href="/dashboard">
              Ver demo
            </Button>
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 backdrop-blur p-4 shadow-xl">
          <div className="h-64 rounded-xl bg-blue-900/40 flex items-center justify-center">
            <img
              src="/dashboard.jpeg"
              alt="Dashboard preview"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
