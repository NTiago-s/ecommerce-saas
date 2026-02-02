import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const AUTHENTICATE = true

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const auth = (req as any).auth

  return res.json({
    ok: true,
    actor_id: auth?.actor_id,
  })
}
