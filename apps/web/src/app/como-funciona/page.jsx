import { ArrowRight, Check, CreditCard, Store, WandSparkles } from "lucide-react";
import Button from "../../ui/button";

export const metadata = {
  title: "Como funciona",
  description:
    "El recorrido para elegir un plan, crear una cuenta y lanzar tu ecommerce en pocos pasos.",
};

const steps = [
  {
    icon: CreditCard,
    title: "Elegis un plan",
    description:
      "Comparas opciones claras y te quedas con la que encaja con tu etapa.",
  },
  {
    icon: WandSparkles,
    title: "Creas tu cuenta",
    description:
      "Registras tu negocio y dejas lista la base para empezar a operar.",
  },
  {
    icon: Store,
    title: "Lanzas tu tienda",
    description:
      "La cuenta queda preparada para que tu ecommerce empiece a vender.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-[var(--border)] bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              Como funciona
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Un recorrido corto para pasar de la idea a la venta.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              El flujo evita pasos innecesarios para que el usuario entienda el
              valor, elija un plan y avance sin friccion.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-4 lg:grid-cols-3">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="surface p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      0{index + 1}
                    </span>
                    <Icon className="size-5 text-[var(--accent)]" aria-hidden="true" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-slate-950">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="surface-soft px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Check className="size-4 text-emerald-600" aria-hidden="true" />
                  Sin pasos innecesarios
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  El objetivo es claro: menos dudas, menos friccion y una
                  conversion mas limpia hacia el plan elegido.
                </p>
              </div>
              <Button href="/planes" size="md">
                Ver planes
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
