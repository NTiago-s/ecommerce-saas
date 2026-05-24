import { Metadata } from "next"
import { notFound } from "next/navigation"

import { listProducts } from "@lib/data/products"
import {
  buildTenantPath,
  getStorefrontBySlug,
} from "@lib/data/storefront"
import StorefrontProductCard from "@modules/storefront/components/storefront-product-card"

type TenantHomePageProps = {
  params: Promise<{
    countryCode: string
    storeSlug: string
  }>
}

export async function generateMetadata(
  props: TenantHomePageProps
): Promise<Metadata> {
  const params = await props.params
  const store = await getStorefrontBySlug(params.storeSlug)

  if (!store) {
    return {}
  }

  const title = `${store.name} | Ecommerce SaaS`
  const description =
    store.description ||
    `${store.name} publica su catalogo desde una tienda multi-tenant.`

  return {
    title,
    description,
    alternates: {
      canonical: buildTenantPath(params.countryCode, store.slug),
    },
    openGraph: {
      title,
      description,
      url: buildTenantPath(params.countryCode, store.slug),
      type: "website",
    },
  }
}

export default async function TenantHomePage(props: TenantHomePageProps) {
  const params = await props.params
  const store = await getStorefrontBySlug(params.storeSlug)

  if (!store) {
    notFound()
  }

  const { response } = await listProducts({
    countryCode: params.countryCode,
    queryParams: {
      limit: 24,
      sales_channel_id: store.salesChannelId,
    },
  })

  const products = response.products || []

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-600 via-slate-900 to-slate-950 p-8 shadow-2xl sm:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
            Tienda publica
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {store.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
            {store.description ||
              "Storefront multi-tenant conectado al catalogo y checkout de Medusa."}
          </p>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-300">Catalogo</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">
              Productos publicados
            </h2>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200">
            {products.length} producto(s)
          </span>
        </div>

        {products.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <StorefrontProductCard
                key={product.id}
                product={product}
                href={buildTenantPath(
                  params.countryCode,
                  store.slug,
                  `products/${product.handle}`
                )}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-10 text-center">
            <h3 className="text-xl font-semibold text-white">
              Esta tienda todavia no tiene productos publicados
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Vuelve pronto o crea el catalogo desde el dashboard SaaS.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
