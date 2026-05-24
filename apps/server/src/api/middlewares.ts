import multer from "multer"

const { defineMiddlewares } = require("@medusajs/framework/http")

const upload = multer({ storage: multer.memoryStorage() })

export default defineMiddlewares({
  routes: [
    {
      method: ["POST"],
      matcher: "/saas/uploads",
      middlewares: [upload.array("files")],
    },
  ],
})
