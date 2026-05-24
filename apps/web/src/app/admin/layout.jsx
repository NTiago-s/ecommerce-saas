import { auth } from "../../auth";
import prisma from "../../lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

const NAV = [
  { href: "/admin/plans", label: "Planes" },
  { href: "/dashboard", label: "Dashboard" },
];

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="surface-soft mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Admin workspace
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Gestión de plataforma
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Control de planes, billing y configuración operativa.
            </p>
          </div>

          <nav className="flex flex-wrap gap-2" aria-label="Navegación admin">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {children}
      </div>
    </div>
  );
}

