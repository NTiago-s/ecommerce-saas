import Link from "next/link";
import Image from "next/image";
import { auth } from "../auth";
import Button from "../ui/button";
import { Menu } from "lucide-react";

const NAV_ITEMS = [
  { href: "/planes", label: "Planes" },
  { href: "/beneficios", label: "Beneficios" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacto", label: "Contacto" },
];

export default async function Header() {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-full px-1 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            aria-label="Ir a la pagina principal de Codeluxe Store"
          >
            <span className="flex size-10 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm">
              <Image
                src="/logo-codeluxe.webp"
                alt="Codeluxe Store"
                width={36}
                height={36}
                className="size-9 rounded-xl object-cover"
                priority
              />
            </span>
            <span className="hidden sm:block">
              <span className="block text-sm font-semibold tracking-tight text-slate-900">
                Codeluxe Store
              </span>
              <span className="block text-xs text-slate-500">
                Crea tu ecommerce
              </span>
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegacion principal">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="lg:hidden">
            <details className="relative">
              <summary className="flex list-none items-center justify-center rounded-full border border-[var(--border)] bg-white p-3 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2">
                <span className="sr-only">Abrir menu</span>
                <Menu className="size-5" aria-hidden="true" />
              </summary>
              <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-[var(--border)] bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-2 border-t border-slate-100 pt-2">
                  {!isLoggedIn ? (
                    <div className="grid gap-2">
                      <Link
                        href="/login"
                        className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Ingresar
                      </Link>
                      <Link
                        href="/planes"
                        className="rounded-xl bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white"
                      >
                        Ver planes
                      </Link>
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      <Link
                        href="/dashboard"
                        className="rounded-xl bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white"
                      >
                        Dashboard
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </details>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {!isLoggedIn ? (
              <>
                <Button variant="outline" href="/login" size="sm">
                  Ingresar
                </Button>
                <Button variant="primary" href="/planes" size="sm">
                  Ver planes
                </Button>
              </>
            ) : (
              <Button variant="primary" href="/dashboard" size="sm">
                Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
