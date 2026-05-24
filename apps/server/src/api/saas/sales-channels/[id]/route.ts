import {
  authorizeSaasRequest,
  forbidden,
  getAllowedSalesChannelIds,
} from "../../../../lib/saas/auth"
import { getSalesChannel } from "../../../../lib/saas/entities"

const { updateSalesChannelsWorkflow } = require("@medusajs/core-flows")

function canAccessChannel(req: any, channelId: string) {
  return getAllowedSalesChannelIds(req).includes(channelId)
}

export async function GET(req: any, res: any) {
  if (!authorizeSaasRequest(req, res)) return

  const channelId = req.params.id
  if (!canAccessChannel(req, channelId)) {
    return forbidden(res, "You cannot access this sales channel.")
  }

  const salesChannel = await getSalesChannel(req.scope, channelId)
  if (!salesChannel) {
    return res.status(404).json({ message: "Sales channel not found." })
  }

  return res.json({ sales_channel: salesChannel })
}

export async function POST(req: any, res: any) {
  if (!authorizeSaasRequest(req, res)) return

  const channelId = req.params.id
  if (!canAccessChannel(req, channelId)) {
    return forbidden(res, "You cannot update this sales channel.")
  }

  const body = req.body as any
  const update: Record<string, unknown> = {}

  if (body.name !== undefined) update.name = body.name
  if (body.description !== undefined) update.description = body.description
  if (body.is_disabled !== undefined) update.is_disabled = body.is_disabled
  if (body.metadata !== undefined) update.metadata = body.metadata

  await updateSalesChannelsWorkflow(req.scope).run({
    input: {
      selector: { id: channelId },
      update,
    },
  })

  const salesChannel = await getSalesChannel(req.scope, channelId)
  return res.json({ sales_channel: salesChannel })
}
