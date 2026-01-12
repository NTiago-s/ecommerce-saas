import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[50vh] flex flex-col items-center justify-center bg-white text-center p-6">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-6">Página no encontrada</p>

      <Link
        href="/"
        className="px-6 py-3 rounded-md text-white bg-linear-to-r from-red-600 to-blue-600 font-medium shadow hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
