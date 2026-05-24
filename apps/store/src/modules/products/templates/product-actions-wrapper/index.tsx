import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
  salesChannelId,
}: {
  id: string
  region: HttpTypes.StoreRegion
  salesChannelId?: string
}) {
  const product = await listProducts({
    queryParams: {
      id: [id],
      ...(salesChannelId ? { sales_channel_id: salesChannelId } : {}),
    },
    regionId: region.id,
  }).then(({ response }) => response.products[0])

  if (!product) {
    return null
  }

  return (
    <ProductActions
      product={product}
      region={region}
      salesChannelId={salesChannelId}
    />
  )
}
