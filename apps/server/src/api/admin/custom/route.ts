export const AUTHENTICATE = true

export async function GET(
  req: any,
  res: any
) {
  const auth = (req as any).auth

  return res.json({
    ok: true,
    actor_id: auth?.actor_id,
  })
}
