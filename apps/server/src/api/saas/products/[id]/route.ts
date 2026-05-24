import {
  authorizeSaasRequest,
  forbidden,
  getAllowedSalesChannelIds,
} from "../../../../lib/saas/auth"
import {
  getProduct,
  productBelongsToSalesChannel,
} from "../../../../lib/saas/entities"

const {
  deleteProductsWorkflow,
  updateProductsWorkflow,
} = require("@medusajs/core-flows")

async function getAllowedProduct(req: any, res: any) {
  const product = await getProduct(req.scope, req.params.id)

  if (!product) {
    res.status(404).json({ message: "Product not found." })
    return null
  }

  if (!productBelongsToSalesChannel(product, getAllowedSalesChannelIds(req))) {
    forbidden(res, "You cannot access this product.")
    return null
  }

  return product
}

export async function GET(req: any, res: any) {
  if (!authorizeSaasRequest(req, res)) return

  const product = await getAllowedProduct(req, res)
  if (!product) return

  return res.json({ product })
}

export async function POST(req: any, res: any) {
  if (!authorizeSaasRequest(req, res)) return

  const product = await getAllowedProduct(req, res)
  if (!product) return

  const { result } = await updateProductsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.body as any,
    },
  })

  const updatedProduct = await getProduct(req.scope, result[0].id)
  return res.json({ product: updatedProduct })
}

export async function DELETE(req: any, res: any) {
  if (!authorizeSaasRequest(req, res)) return

  const product = await getAllowedProduct(req, res)
  if (!product) return

  await deleteProductsWorkflow(req.scope).run({
    input: { ids: [req.params.id] },
  })

  return res.json({
    id: req.params.id,
    object: "product",
    deleted: true,
  })
}
