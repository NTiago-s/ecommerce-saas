import Link from "next/link";
import { Menu } from "lucide-react";
import Button from "../ui/button";
import { auth } from "../auth";

export default async function Header() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="sticky top-0 left-0 w-full border-b border-gray-200 bg-white shadow-sm z-50">
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Menú Mobile */}
          <div className="flex lg:hidden">
            <button className="text-gray-600 hover:text-black">
              <Menu size={24} />
            </button>
          </div>

          {/* Logo */}
          <div className="shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tighter italic"
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

          {/* Acciones */}
          <div className="flex items-center space-x-5">
            {!isLoggedIn ? (
              <>
                <Button variant="primary" href="/login">
                  Iniciar Sesión
                </Button>
                <Button variant="outline" href="/register">
                  Registrarse
                </Button>
              </>
            ) : (
              <Button variant="primary" href="/dashboard">
                Dashboard
              </Button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
