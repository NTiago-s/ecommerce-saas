import { authorizeSaasRequest } from "../../../lib/saas/auth"

const {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} = require("@medusajs/framework/utils")

export async function GET(req: any, res: any) {
  if (!authorizeSaasRequest(req, res)) return

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const query = remoteQueryObjectFromString({
    entryPoint: "shipping_profiles",
    variables: {
      filters: {},
      skip: 0,
      take: 1000,
    },
    fields: ["id", "name", "type", "metadata", "created_at", "updated_at"],
  })

  const result = await remoteQuery(query)
  const shippingProfiles = Array.isArray(result) ? result : result.rows ?? []

  return res.json({ shipping_profiles: shippingProfiles })
}
