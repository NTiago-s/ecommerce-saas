import Link from "next/link"

import { Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import Thumbnail from "@modules/products/components/thumbnail"

type StorefrontProductCardProps = {
  href: string
  product: HttpTypes.StoreProduct
}

export default function StorefrontProductCard({
  href,
  product,
}: StorefrontProductCardProps) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <Link href={href} className="group">
      <div data-testid="tenant-product-card">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
        />
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <Text className="text-ui-fg-base" data-testid="product-title">
              {product.title}
            </Text>
            {product.subtitle ? (
              <p className="mt-1 text-sm text-ui-fg-subtle">{product.subtitle}</p>
            ) : null}
          </div>
          <div className="text-right text-sm font-medium text-ui-fg-base">
            {cheapestPrice?.calculated_price || "Consultar"}
          </div>
        </div>
      </div>
    </Link>
  )
}
