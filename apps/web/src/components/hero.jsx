import Image from "next/image";
import { BadgeCheck, CreditCard, Store, Truck } from "lucide-react";
import Button from "../ui/button";

const stats = [
  { value: "4", label: "planes disponibles" },
  { value: "1", label: "suscripcion por cuenta" },
  { value: "0", label: "friccion para empezar" },
];

const highlights = [
  { icon: Store, label: "Tu marca propia" },
  { icon: CreditCard, label: "Cobro mensual" },
  { icon: Truck, label: "Lista para vender" },
  { icon: BadgeCheck, label: "Plan libre incluido" },
];

export default function Hero() {
  return (
    <section aria-labelledby="hero-title">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
            Crea tu ecommerce
          </span>

          <h1
            id="hero-title"
            className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
          >
            Lanza tu tienda online con planes simples y una base lista para vender.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Elegi un plan, crea tu cuenta y arranca con una experiencia clara,
            minimalista y pensada para convertir visitas en clientes.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/planes" size="lg">
              Ver planes
            </Button>
            <Button href="/register" variant="outline" size="lg">
              Empezar gratis
            </Button>
          </div>

          <dl className="mt-10 grid gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[var(--border)] bg-white px-4 py-4"
              >
                <dt className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                  {item.label}
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-slate-950">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="surface-soft overflow-hidden p-3">
          <div className="rounded-[1.25rem] border border-[var(--border)] bg-slate-950 p-4 text-white">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                  <Image
                    src="/logo-codeluxe.webp"
                    alt="Codeluxe Store"
                    width={36}
                    height={36}
                    className="size-8 rounded-xl object-cover"
                    priority
                  />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Ecommerce listo
                  </p>
                  <p className="text-sm font-medium text-white">
                    Tu tienda propia
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                checkout activo
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <Icon className="size-5 text-sky-300" aria-hidden="true" />
                    <p className="mt-3 text-sm font-medium text-white">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Plan recomendado
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    Intermedio
                  </p>
                </div>
                <p className="text-right text-2xl font-semibold text-white">
                  US$ 33
                </p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Ideal para crecer con mas de una tienda y mantener todo bajo una
                misma suscripcion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
