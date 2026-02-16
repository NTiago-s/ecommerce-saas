import { Metadata } from "next"

import ProductsOverview from "@modules/account/components/products-overview"
import {
  getProductsFromMedusa,
  getRegions,
} from "actions/store-actions/get-actions"

export const metadata: Metadata = {
  title: "Products",
  description: "View and manage your products.",
}

export default async function Products() {
  const regions = await getRegions()
  const data = await getProductsFromMedusa(regions[0].id)
  return (
    <div className="w-full" data-testid="products-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Productos</h1>
      </div>
      <div>
        <ProductsOverview products={data} />
      </div>
    </div>
  )
}
