import Button from "../ui/button";

export default function CTA() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="cta-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="surface flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center md:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
              Listo para empezar
            </p>
            <h2
              id="cta-title"
              className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
            >
              Elegi el plan adecuado y lanzá tu ecommerce sin rodeos.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Una experiencia pensada para convertir visitas en registros y
              registros en tiendas activas.
            </p>
          </div>

          <Button href="/planes" size="lg">
            Ver planes
          </Button>
        </div>
      </div>
    </section>
  );
}
