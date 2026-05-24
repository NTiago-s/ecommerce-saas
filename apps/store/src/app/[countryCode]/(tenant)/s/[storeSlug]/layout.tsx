import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { getStorefrontBySlug } from "@lib/data/storefront"

type TenantLayoutProps = {
  children: ReactNode
  params: Promise<{
    countryCode: string
    storeSlug: string
  }>
}

export default async function TenantStoreLayout(props: TenantLayoutProps) {
  const params = await props.params
  const store = await getStorefrontBySlug(params.storeSlug)

  if (!store) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Storefront
            </p>
            <Link
              href={`/${params.countryCode}/s/${store.slug}`}
              className="mt-1 block text-2xl font-semibold tracking-tight text-white"
            >
              {store.name}
            </Link>
          </div>

          <nav className="flex items-center gap-3 text-sm text-slate-200">
            <Link
              href={`/${params.countryCode}/s/${store.slug}`}
              className="rounded-full border border-white/10 px-4 py-2 hover:border-white/20 hover:bg-white/5"
            >
              Inicio
            </Link>
            <Link
              href={`/${params.countryCode}/cart`}
              className="rounded-full bg-white px-4 py-2 font-medium text-slate-950"
            >
              Carrito
            </Link>
          </nav>
        </div>
      </header>

      <main>{props.children}</main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-slate-300 sm:px-6 lg:px-8">
          <p>{store.name}</p>
          <p>
            Ecommerce publicado desde un tenant multi-tenant conectado a Medusa.
          </p>
        </div>
      </footer>
    </div>
  )
}
