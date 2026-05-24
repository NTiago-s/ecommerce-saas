const API_KEY_HEADER = "x-saas-api-key"
const SALES_CHANNEL_HEADER = "x-saas-sales-channel-ids"

function readHeader(req: any, name: string): string {
  const value = req.headers[name]
  return Array.isArray(value) ? value[0] ?? "" : value ?? ""
}

export function authorizeSaasRequest(
  req: any,
  res: any
): boolean {
  const expectedKey = process.env.SAAS_INTERNAL_API_KEY

  if (!expectedKey) {
    res.status(500).json({
      message: "SAAS_INTERNAL_API_KEY is not configured in Medusa.",
    })
    return false
  }

  if (readHeader(req, API_KEY_HEADER) !== expectedKey) {
    res.status(401).json({ message: "Unauthorized SaaS request." })
    return false
  }

  return true
}

export function getAllowedSalesChannelIds(req: any): string[] {
  return readHeader(req, SALES_CHANNEL_HEADER)
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
}

export function idsFromQuery(req: any, key: string): string[] {
  const url = new URL(req.originalUrl || req.url, "http://localhost")
  const repeated = url.searchParams.getAll(key).flatMap((value) =>
    value
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
  )

  return [...new Set(repeated)]
}

export function isSubset(requestedIds: string[], allowedIds: string[]) {
  const allowed = new Set(allowedIds)
  return requestedIds.every((id) => allowed.has(id))
}

export function forbidden(res: any, message = "Forbidden") {
  return res.status(403).json({ message })
}
