import { auth } from "../../auth";
import prisma from "../../lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

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
    <div className="min-h-[calc(100vh-80px)] bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
            <p className="mt-1 text-sm text-gray-600">
              Panel de administración
            </p>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              href="/admin/plans"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Planes
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Ir a mi tienda
            </Link>
          </nav>
        </div>

        {children}
      </div>
    </div>
  );
}
