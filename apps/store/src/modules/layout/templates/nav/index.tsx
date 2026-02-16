import { Menu } from "@headlessui/react"
import { User } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Button from "ui/button"
export default function Header({ customer }: { customer: any }) {
  return (
    <div className="sticky top-0 left-0 w-full border-b border-gray-200 bg-white shadow-sm z-50">
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Menú Mobile */}
          <div className="flex lg:hidden">
            <button className="text-gray-600 hover:text-black">
              <Menu />
            </button>
          </div>

          {/* Logo */}
          <div className="shrink-0">
            <LocalizedClientLink
              href="/"
              className="text-2xl font-bold tracking-tighter text-black italic"
            >
              <img
                src="/logo-codeluxe.webp"
                alt="CodeLuxe Logo"
                className="w-16 h-16 rounded-full border border-gray-200"
              />
            </LocalizedClientLink>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden lg:flex lg:space-x-8">
            <LocalizedClientLink
              href="/catalog"
              className="text-sm font-medium text-gray-700 hover:underline underline-offset-4"
            >
              Catálogo
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/new-arrivals"
              className="text-sm font-medium text-gray-700 hover:underline underline-offset-4"
            >
              Novedades
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/sale"
              className="text-sm font-medium text-blue-600 hover:underline underline-offset-4"
            >
              Ofertas
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:underline underline-offset-4"
            >
              Contacto
            </LocalizedClientLink>
          </nav>

          <div className="flex items-center space-x-5">
            {!customer ? (
              <>
                <Button variant="outline" href="/account">
                  Iniciar Sesión
                </Button>

                <Button variant="outline" href="/account">
                  Registrarse
                </Button>
              </>
            ) : (
              <LocalizedClientLink
                href="/account"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <User /> {customer?.first_name}
              </LocalizedClientLink>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}
