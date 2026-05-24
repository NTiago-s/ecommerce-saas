const {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} = require("@medusajs/framework/utils")

export const SALES_CHANNEL_FIELDS = [
  "id",
  "name",
  "description",
  "is_disabled",
  "metadata",
  "created_at",
  "updated_at",
]

export const PRODUCT_FIELDS = [
  "id",
  "title",
  "subtitle",
  "handle",
  "description",
  "status",
  "thumbnail",
  "discountable",
  "metadata",
  "created_at",
  "updated_at",
  "sales_channels.id",
  "sales_channels.name",
  "images.id",
  "images.url",
  "variants.id",
  "variants.title",
  "variants.sku",
  "variants.manage_inventory",
  "variants.allow_backorder",
  "variants.price_set.prices.id",
  "variants.price_set.prices.amount",
  "variants.price_set.prices.currency_code",
  "variants.price_set.prices.created_at",
  "variants.price_set.prices.updated_at",
]

type RemoteQueryResult<T> = T[] | { rows?: T[] }

function rows<T>(result: RemoteQueryResult<T>): T[] {
  return Array.isArray(result) ? result : result.rows ?? []
}

function remapVariantResponse(variant: any) {
  if (!variant) return variant

  const prices = variant.price_set?.prices?.map((price: any) => ({
    id: price.id,
    amount: price.amount,
    currency_code: price.currency_code,
    variant_id: variant.id,
    created_at: price.created_at,
    updated_at: price.updated_at,
  }))

  const { price_set, ...rest } = variant
  return { ...rest, prices: prices ?? rest.prices ?? [] }
}

export function remapProductResponse(product: any) {
  if (!product) return product

  return {
    ...product,
    variants: product.variants?.map(remapVariantResponse) ?? [],
  }
}

export async function listSalesChannels(
  scope: any,
  ids: string[] = []
) {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const query = remoteQueryObjectFromString({
    entryPoint: "sales_channels",
    variables: {
      filters: ids.length ? { id: ids } : {},
      skip: 0,
      take: 1000,
    },
    fields: SALES_CHANNEL_FIELDS,
  })

  const result = await remoteQuery(query)
  return rows<any>(result)
}

export async function getSalesChannel(scope: any, id: string) {
  const [channel] = await listSalesChannels(scope, [id])
  return channel ?? null
}

export async function listProducts(scope: any) {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const query = remoteQueryObjectFromString({
    entryPoint: "products",
    variables: {
      filters: {},
      skip: 0,
      take: 1000,
    },
    fields: PRODUCT_FIELDS,
  })

  const result = await remoteQuery(query)
  return rows<any>(result).map(remapProductResponse)
}

export async function getProduct(scope: any, id: string) {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const query = remoteQueryObjectFromString({
    entryPoint: "product",
    variables: {
      filters: { id },
    },
    fields: PRODUCT_FIELDS,
  })

  const result = await remoteQuery(query)
  return remapProductResponse(rows<any>(result)[0] ?? null)
}

export function productBelongsToSalesChannel(
  product: any,
  allowedSalesChannelIds: string[]
) {
  if (!product || !allowedSalesChannelIds.length) return false

  const allowed = new Set(allowedSalesChannelIds)
  return (product.sales_channels ?? []).some((channel: any) =>
    allowed.has(channel.id)
  )
}

export function filterProductsBySalesChannels(
  products: any[],
  salesChannelIds: string[]
) {
  if (!salesChannelIds.length) return []

  const selected = new Set(salesChannelIds)
  return products.filter((product) =>
    (product.sales_channels ?? []).some((channel: any) =>
      selected.has(channel.id)
    )
  )
}
