import {
  authorizeSaasRequest,
  forbidden,
  getAllowedSalesChannelIds,
  idsFromQuery,
  isSubset,
} from "../../../lib/saas/auth"
import {
  filterProductsBySalesChannels,
  getProduct,
  listProducts,
} from "../../../lib/saas/entities"

const { createProductsWorkflow } = require("@medusajs/core-flows")

function salesChannelIdsFromProductPayload(product: any) {
  return (product?.sales_channels ?? [])
    .map((channel: any) => (typeof channel === "string" ? channel : channel?.id))
    .filter(Boolean)
}

export async function GET(req: any, res: any) {
  if (!authorizeSaasRequest(req, res)) return

  const allowedIds = getAllowedSalesChannelIds(req)
  const requestedIds = idsFromQuery(req, "sales_channel_id")
  const selectedIds = requestedIds.length ? requestedIds : allowedIds

  if (!selectedIds.length) {
    return res.json({ products: [] })
  }

  if (!isSubset(selectedIds, allowedIds)) {
    return forbidden(res, "You cannot list products for this sales channel.")
  }

  const products = await listProducts(req.scope)
  return res.json({
    products: filterProductsBySalesChannels(products, selectedIds),
  })
}

export async function POST(req: any, res: any) {
  if (!authorizeSaasRequest(req, res)) return

  const allowedIds = getAllowedSalesChannelIds(req)
  const product = req.body as any
  const requestedIds = salesChannelIdsFromProductPayload(product)

  if (!requestedIds.length) {
    return res.status(400).json({ message: "Select at least one store." })
  }

  if (!isSubset(requestedIds, allowedIds)) {
    return forbidden(res, "You cannot create products in this sales channel.")
  }

  const { result } = await createProductsWorkflow(req.scope).run({
    input: { products: [product] },
  })

  const createdProduct = await getProduct(req.scope, result[0].id)
  return res.status(201).json({ product: createdProduct })
}
