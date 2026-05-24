import { LayoutGrid, ShieldCheck, CreditCard } from "lucide-react";

const FEATURES = [
  {
    title: "Lanzamiento simple",
    description:
      "Empezas con un plan gratis o pago sin navegar una estructura compleja.",
    icon: LayoutGrid,
  },
  {
    title: "Planes que se entienden",
    description:
      "Límites claros de tiendas y productos, con una propuesta comercial directa.",
    icon: CreditCard,
  },
  {
    title: "Base preparada para crecer",
    description:
      "La arquitectura acompaña el crecimiento sin que el sitio público lo cargue de complejidad.",
    icon: ShieldCheck,
  },
];

export default function Features() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="features-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <h2
            id="features-title"
            className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
          >
            Beneficios pensados para convertir
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            La web tiene que vender el plan correcto con rapidez: claridad,
            confianza y pocos pasos.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="surface p-6 transition hover:-translate-y-0.5"
              >
                <div className="inline-flex size-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-slate-50">
                  <Icon className="size-5 text-[var(--accent)]" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
