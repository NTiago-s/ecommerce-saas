import Link from "next/link";
import { ArrowRight, CreditCard, LayoutGrid } from "lucide-react";

const CARDS = [
  {
    href: "/admin/plans",
    title: "Planes",
    description: "Crear, editar y sincronizar planes con Mercado Pago.",
    icon: CreditCard,
  },
  {
    href: "/dashboard",
    title: "Dashboard",
    description: "Volver al panel operativo de tiendas y productos.",
    icon: LayoutGrid,
  },
];

export default async function AdminPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.href}
            href={card.href}
            className="surface group flex items-start justify-between gap-4 p-6 transition hover:-translate-y-0.5 hover:border-slate-300"
          >
            <div>
              <div className="inline-flex size-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-slate-50">
                <Icon className="size-5 text-[var(--accent)]" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">
                {card.title}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                {card.description}
              </p>
            </div>

            <ArrowRight className="mt-1 size-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700" />
          </Link>
        );
      })}
    </div>
  );
}

