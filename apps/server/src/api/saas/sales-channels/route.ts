import {
  authorizeSaasRequest,
  getAllowedSalesChannelIds,
} from "../../../lib/saas/auth"
import { getSalesChannel, listSalesChannels } from "../../../lib/saas/entities"

const { createSalesChannelsWorkflow } = require("@medusajs/core-flows")

export async function GET(req: any, res: any) {
  if (!authorizeSaasRequest(req, res)) return

  const allowedIds = getAllowedSalesChannelIds(req)
  if (!allowedIds.length) {
    return res.json({ sales_channels: [] })
  }

  const salesChannels = await listSalesChannels(req.scope, allowedIds)
  return res.json({ sales_channels: salesChannels })
}

export async function POST(req: any, res: any) {
  if (!authorizeSaasRequest(req, res)) return

  const body = req.body as any

  if (!body?.name) {
    return res.status(400).json({ message: "Sales channel name is required." })
  }

  const { result } = await createSalesChannelsWorkflow(req.scope).run({
    input: {
      salesChannelsData: [
        {
          name: body.name,
          description: body.description,
          is_disabled: body.is_disabled ?? false,
          metadata: body.metadata ?? {},
        },
      ],
    },
  })

  const salesChannel = await getSalesChannel(req.scope, result[0].id)
  return res.status(201).json({ sales_channel: salesChannel })
}
