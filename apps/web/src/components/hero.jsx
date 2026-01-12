export default function Hero() {
  return (
    <section className="bg-linear-to-br from-emerald-600 to-emerald-800 text-white">
      <div className="mx-auto max-w-7xl px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Crea y gestiona tus tiendas online
            <span className="block text-emerald-200">desde un solo lugar</span>
          </h1>

          <p className="mt-6 text-lg text-emerald-100">
            Administra múltiples tiendas, planes de suscripción y pagos con una
            plataforma simple y escalable.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="rounded-lg bg-white px-6 py-3 text-emerald-700 font-semibold hover:bg-emerald-100">
              Empezar ahora
            </button>

            <button className="rounded-lg border border-white/40 px-6 py-3 hover:bg-white/10">
              Ver demo
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 backdrop-blur p-6 shadow-xl">
          <div className="h-64 rounded-xl bg-emerald-900/40 flex items-center justify-center">
            <span className="text-emerald-200">Preview del dashboard</span>
          </div>
        </div>
      </div>
    </section>
  );
}
