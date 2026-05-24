import { CheckCircle2, Palette, ShieldCheck, Store } from "lucide-react";
import Button from "../../ui/button";

export const metadata = {
  title: "Beneficios",
  description:
    "Por que Codeluxe Store ayuda a vender planes y crear ecommerce sin complejidad innecesaria.",
};

const benefits = [
  {
    icon: Store,
    title: "Tu ecommerce, no una herramienta mas",
    description:
      "La propuesta esta enfocada en lanzar una tienda propia con identidad y recorrido claro.",
  },
  {
    icon: ShieldCheck,
    title: "Decisiones simples",
    description:
      "Planes faciles de comparar, limites transparentes y una compra sin ruido.",
  },
  {
    icon: Palette,
    title: "UI minimalista",
    description:
      "La experiencia reduce distracciones y guia al usuario hacia el plan correcto.",
  },
  {
    icon: CheckCircle2,
    title: "Crecimiento ordenado",
    description:
      "Empiezas gratis y subes de plan cuando tu negocio lo necesita.",
  },
];

export default function BeneficiosPage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-[var(--border)] bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              Beneficios
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Todo esta diseñado para que compres el plan y lances tu ecommerce.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              La web publica no explica funciones internas. Explica el valor del
              producto y lleva a la decision correcta.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/planes" size="lg">
                Ver planes
              </Button>
              <Button href="/register" variant="outline" size="lg">
                Empezar gratis
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="surface p-6">
                  <div className="inline-flex size-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-slate-50">
                    <Icon className="size-5 text-[var(--accent)]" aria-hidden="true" />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-slate-950">
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
    </main>
  );
}
