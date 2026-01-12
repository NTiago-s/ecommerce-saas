import Link from "next/link";
import { Menu } from "lucide-react";
import Button from "../ui/button";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 w-full z-50 border-b border-gray-200 bg-white shadow-sm">
      {/* Header Principal */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Menú Mobile (Solo visible en móviles) */}
          <div className="flex lg:hidden">
            <button className="text-gray-600 hover:text-black">
              <Menu size={24} />
            </button>
          </div>

          {/* Logo */}
          <div className="shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tighter text-black italic"
            >
              <img
                src="/logo-codeluxe.webp"
                alt="CodeLuxe Logo"
                className="size-18 rounded-full border border-gray-200"
              />
            </Link>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden lg:flex lg:space-x-8">
            <Link
              href="/catalog"
              className="text-sm font-medium text-gray-700 hover:underline underline-offset-4"
            >
              Catálogo
            </Link>
            <Link
              href="/new-arrivals"
              className="text-sm font-medium text-gray-700 hover:underline underline-offset-4"
            >
              Novedades
            </Link>
            <Link
              href="/sale"
              className="text-sm font-medium text-blue-600 hover:underline underline-offset-4"
            >
              Ofertas
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:underline underline-offset-4"
            >
              Contacto
            </Link>
          </nav>

          {/* Iconos de Acción */}
          <div className="flex items-center space-x-5">
            <Button variant="primary" href="/login">
              Iniciar Sesión
            </Button>
            <Button variant="outline" href="/register">
              Registrarse
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}
