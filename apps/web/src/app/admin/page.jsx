import Link from "next/link";

export default async function AdminPage() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link
        href="/admin/plans"
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
      >
        <h2 className="text-lg font-bold text-gray-900">Planes</h2>
        <p className="mt-1 text-sm text-gray-600">
          Crear, editar y eliminar planes.
        </p>
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm opacity-60">
        <h2 className="text-lg font-bold text-gray-900">Usuarios</h2>
        <p className="mt-1 text-sm text-gray-600">Próximamente</p>
      </div>
    </div>
  );
}
