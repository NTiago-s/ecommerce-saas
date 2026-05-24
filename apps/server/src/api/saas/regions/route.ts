import { authorizeSaasRequest } from "../../../lib/saas/auth"

const {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} = require("@medusajs/framework/utils")

export async function GET(req: any, res: any) {
  if (!authorizeSaasRequest(req, res)) return

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const query = remoteQueryObjectFromString({
    entryPoint: "region",
    variables: {
      filters: {},
      skip: 0,
      take: 1000,
    },
    fields: [
      "id",
      "name",
      "currency_code",
      "countries.iso_2",
      "countries.display_name",
    ],
  })

  const result = await remoteQuery(query)
  const regions = Array.isArray(result) ? result : result.rows ?? []

  return res.json({ regions })
}
