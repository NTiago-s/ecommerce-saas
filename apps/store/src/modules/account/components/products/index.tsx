"use client"
import { useState, useEffect } from "react"
import ProductGridClient from "../products-overview"
import {
  getProductsFromMedusa,
  getRegions,
} from "actions/store-actions/get-actions"

export default function Products() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar datos al iniciar
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const regions = await getRegions()
      if (regions.length > 0) {
        const data = await getProductsFromMedusa(regions[0].id)
        setProducts(data as any)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div className="min-h-screen flex bg-gray-100">
      <ProductGridClient products={products} />
    </div>
  )
}
