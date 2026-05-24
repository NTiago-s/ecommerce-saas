import { Check, CircleDollarSign, CreditCard, RefreshCcw } from "lucide-react";
import Button from "../../ui/button";
import Pricing from "../../components/pricing/pricing";

export const metadata = {
  title: "Planes",
  description:
    "Planes mensuales para crear tu ecommerce con limites claros, plan gratis y cobro simple.",
};

const billingNotes = [
  {
    icon: CreditCard,
    title: "Una cuenta, un plan",
    description:
      "Elegis un plan para toda la cuenta y creces sin pagar por cada tienda por separado.",
  },
  {
    icon: CircleDollarSign,
    title: "Precios en USD",
    description:
      "Los valores se muestran en USD y se convierten a ARS al dolar oficial al cobrar.",
  },
  {
    icon: RefreshCcw,
    title: "Sincronizacion automatica",
    description:
      "La sincronizacion mantiene los montos alineados sin tocar la experiencia publica.",
  },
];

export default function PlanesPage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-[var(--border)] bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              Planes
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Elige el plan y empieza a vender con tu propia tienda.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Todo esta organizado para que compres una vez, actives tu cuenta y
              publiques tu ecommerce con la menor friccion posible.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/register" size="lg">
                Empezar gratis
              </Button>
              <Button href="/faq" variant="outline" size="lg">
                Ver preguntas frecuentes
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Pricing />

      <section className="pb-20 pt-4">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-4 lg:grid-cols-3">
            {billingNotes.map((item) => {
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

          <div className="mt-4 surface-soft px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Check className="size-4 text-emerald-600" aria-hidden="true" />
                  Pago mensual con Mercado Pago
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  La web publica se enfoca en la compra del plan y en explicar
                  el valor de la suscripcion, no la administracion interna.
                </p>
              </div>
              <Button href="/register" size="md">
                Crear cuenta
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
