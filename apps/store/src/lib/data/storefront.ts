import "server-only"

import { cache } from "react"

export type StorefrontStore = {
  id: string
  name: string
  slug: string
  status: string
  description: string
  salesChannelId: string
  path: string
  url: string
}

function getSaasWebUrl() {
  return (
    process.env.SAAS_WEB_URL ||
    process.env.NEXT_PUBLIC_SAAS_WEB_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "")
}

export function buildTenantPath(
  countryCode: string,
  storeSlug: string,
  suffix = ""
) {
  const normalizedCountryCode = String(countryCode).trim().toLowerCase()
  const normalizedStoreSlug = String(storeSlug).trim().toLowerCase()
  const normalizedSuffix = suffix ? `/${String(suffix).replace(/^\/+/, "")}` : ""

  return `/${normalizedCountryCode}/s/${normalizedStoreSlug}${normalizedSuffix}`
}

export const getStorefrontBySlug = cache(async (storeSlug: string) => {
  const response = await fetch(
    `${getSaasWebUrl()}/api/public/storefront/${encodeURIComponent(storeSlug)}`,
    {
      next: {
        revalidate: 300,
      },
      cache: "force-cache",
    }
  ).catch(() => null)

  if (!response?.ok) {
    return null
  }

  const data = (await response.json()) as { store?: StorefrontStore }
  return data.store ?? null
})
