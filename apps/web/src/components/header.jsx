import Link from "next/link";
import { Menu } from "lucide-react";
import Button from "../ui/button";
import { auth } from "../auth";
import prisma from "../lib/prisma";

export default async function Header() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.id
    ? (
        await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { role: true },
        })
      )?.role === "ADMIN"
    : false;

  return (
    <div className="sticky top-0 left-0 w-full border-b border-gray-200 bg-white shadow-sm z-50">
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Menú Mobile */}
          <div className="flex lg:hidden">
            <button
              className="text-gray-600 hover:text-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
              aria-label="Abrir menú de navegación"
              aria-expanded="false"
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>

          {/* Logo */}
          <div className="shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tighter italic focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
              aria-label="Ir a la página principal de Codeluxe Store"
            >
              <img
                src="/logo-codeluxe.webp"
                alt="Codeluxe Store - Logo"
                className="size-18 rounded-full border border-gray-200"
                loading="lazy"
                decoding="async"
              />
            </Link>
          </div>

          {/* Navegación Desktop */}
          <nav
            className="hidden lg:flex lg:space-x-8"
            aria-label="Navegación principal"
            role="navigation"
          >
            <Link
              href="/catalog"
              className="text-sm font-medium text-gray-700 hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
              aria-label="Ver catálogo de productos"
            >
              Catálogo
            </Link>
            <Link
              href="/new-arrivals"
              className="text-sm font-medium text-gray-700 hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
              aria-label="Ver últimas novedades"
            >
              Novedades
            </Link>
            <Link
              href="/sale"
              className="text-sm font-medium text-blue-600 hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
              aria-label="Ver ofertas y promociones"
            >
              Ofertas
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
              aria-label="Contactar con soporte"
            >
              Contacto
            </Link>
          </nav>

          {/* Acciones */}
          <div
            className="flex items-center space-x-5"
            role="group"
            aria-label="Acciones de usuario"
          >
            {!isLoggedIn ? (
              <>
                <Button
                  variant="primary"
                  href="/login"
                  aria-label="Iniciar sesión en tu cuenta"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  variant="outline"
                  href="/register"
                  aria-label="Crear una nueva cuenta"
                >
                  Registrarse
                </Button>
              </>
            ) : (
              <>
                {isAdmin ? (
                  <Button
                    variant="outline"
                    href="/admin"
                    aria-label="Ir al panel de administración"
                  >
                    Admin
                  </Button>
                ) : null}
                <Button
                  variant="primary"
                  href="/dashboard"
                  aria-label="Ir al dashboard principal"
                >
                  Dashboard
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
