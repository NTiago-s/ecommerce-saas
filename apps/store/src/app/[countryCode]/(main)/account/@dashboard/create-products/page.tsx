import { Metadata } from "next"

import CreateProductOverView from "@modules/account/components/create-products-overview"

export const metadata: Metadata = {
  title: "Create Products",
  description: "Create new products for your store.",
}

export default async function CreateProducts() {
  return (
    <div className="w-full" data-testid="create-products-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Create Products</h1>
        <p className="text-base-regular">Create new products for your store.</p>
      </div>
      <div>
        <CreateProductOverView />
      </div>
    </div>
  )
}
