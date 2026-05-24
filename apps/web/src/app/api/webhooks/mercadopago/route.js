import { verifyMercadoPagoWebhook } from "../../../../lib/mercadopago-webhook";
import { syncMercadoPagoSubscriptionByPreapprovalId } from "../../../../lib/mercadopago-subscription";

export async function POST(req) {
  let body = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const url = new URL(req.url);
  const verification = verifyMercadoPagoWebhook({
    headers: req.headers,
    url,
    bodyJson: body,
  });

  if (!verification.ok) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const preapprovalId = verification.dataId;

  await syncMercadoPagoSubscriptionByPreapprovalId(preapprovalId);

  return Response.json({ ok: true });
}
