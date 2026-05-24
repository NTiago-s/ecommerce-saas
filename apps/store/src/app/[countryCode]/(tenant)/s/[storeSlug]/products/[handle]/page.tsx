import Link from "next/link"
import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getRegion } from "@lib/data/regions"
import {
  buildTenantPath,
  getStorefrontBySlug,
} from "@lib/data/storefront"
import { listProducts } from "@lib/data/products"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductTabs from "@modules/products/components/product-tabs"
import ProductActionsWrapper from "@modules/products/templates/product-actions-wrapper"

type TenantProductPageProps = {
  params: Promise<{
    countryCode: string
    storeSlug: string
    handle: string
  }>
}

export async function generateMetadata(
  props: TenantProductPageProps
): Promise<Metadata> {
  const params = await props.params
  const store = await getStorefrontBySlug(params.storeSlug)

  if (!store) {
    return {}
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: {
      handle: params.handle,
      sales_channel_id: store.salesChannelId,
    },
  }).then(({ response }) => response.products[0])

  if (!product) {
    return {}
  }

  const title = `${product.title} | ${store.name}`
  const description = product.description || `${product.title} en ${store.name}`
  const canonical = buildTenantPath(
    params.countryCode,
    store.slug,
    `products/${product.handle}`
  )

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function TenantProductPage(props: TenantProductPageProps) {
  const params = await props.params
  const store = await getStorefrontBySlug(params.storeSlug)

  if (!store) {
    notFound()
  }

  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: {
      handle: params.handle,
      sales_channel_id: store.salesChannelId,
    },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href={buildTenantPath(params.countryCode, store.slug)}
        className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/5"
      >
        Volver a {store.name}
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,420px)]">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-blue-200">{store.name}</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
              {product.title}
            </h1>
            {product.description ? (
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                {product.description}
              </p>
            ) : null}
          </div>

          <ImageGallery images={product.images || []} />
          <div className="rounded-[2rem] border border-white/10 bg-white p-6 text-slate-950">
            <ProductTabs product={product} />
          </div>
        </div>

        <aside className="rounded-[2rem] border border-white/10 bg-white p-6 text-slate-950 shadow-xl">
          <ProductActionsWrapper
            id={product.id}
            region={region}
            salesChannelId={store.salesChannelId}
          />
        </aside>
      </div>
    </div>
  )
}
