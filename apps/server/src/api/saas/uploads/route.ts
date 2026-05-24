import { authorizeSaasRequest } from "../../../lib/saas/auth"

const { uploadFilesWorkflow } = require("@medusajs/core-flows")

export async function POST(req: any, res: any) {
  if (!authorizeSaasRequest(req, res)) return

  const files = (req as any).files ?? []

  if (!files.length) {
    return res.status(400).json({ message: "No files were uploaded." })
  }

  const { result } = await uploadFilesWorkflow(req.scope).run({
    input: {
      files: files.map((file: any) => ({
        filename: file.originalname,
        mimeType: file.mimetype,
        content: file.buffer.toString("base64"),
        access: "public",
      })),
    },
  })

  return res.status(201).json({ files: result })
}
