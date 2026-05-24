import Link from "next/link";
import Image from "next/image";

export default function AuthShell({
  badge,
  title,
  description,
  children,
  footer,
}) {
  return (
    <main className="min-h-[calc(100vh-5rem)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
        <aside className="surface-soft overflow-hidden p-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            aria-label="Ir a la pagina principal"
          >
            <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-white shadow-sm">
              <Image
                src="/logo-codeluxe.webp"
                alt="Codeluxe Store"
                width={36}
                height={36}
                className="size-9 rounded-xl object-cover"
              />
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-900">
                Codeluxe Store
              </span>
              <span className="block text-xs text-slate-500">
                Ecommerce SaaS
              </span>
            </span>
          </Link>

          <div className="mt-16 max-w-md">
            {badge ? (
              <span className="inline-flex rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                {badge}
              </span>
            ) : null}
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
              {title}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {description}
            </p>

            <div className="mt-10 grid gap-3">
              <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-4">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                  Arquitectura
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Tu tienda, tu plan y la infraestructura separados para crecer
                  sin complicar la experiencia.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-4">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                  Enfoque
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Minimalista, comercial y orientado a conversiones.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <section className="surface bg-white p-6 sm:p-8">{children}</section>
      </div>
      {footer ? <div className="mx-auto mt-6 max-w-6xl">{footer}</div> : null}
    </main>
  );
}
