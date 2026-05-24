import crypto from "crypto";

function getHeader(headers, name) {
  // Next Request headers is a Headers instance.
  const v = headers.get(name) ?? headers.get(name.toLowerCase());
  return v ? String(v) : "";
}

function parseXSignature(value) {
  // Expected format: "ts=1234567890,v1=abcdef..."
  const out = {};
  String(value ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .forEach((pair) => {
      const [k, ...rest] = pair.split("=");
      const key = String(k ?? "").trim();
      const val = rest.join("=").trim();
      if (key) out[key] = val;
    });
  return out;
}

function timingSafeEqualHex(aHex, bHex) {
  const a = Buffer.from(String(aHex ?? ""), "hex");
  const b = Buffer.from(String(bHex ?? ""), "hex");
  if (a.length === 0 || b.length === 0) return false;
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function verifyMercadoPagoWebhook({ headers, url, bodyJson }) {
  const secret = String(process.env.MERCADOPAGO_WEBHOOK_SECRET ?? "").trim();
  if (!secret) {
    throw new Error("MERCADOPAGO_WEBHOOK_SECRET no configurado");
  }

  const xSignature = getHeader(headers, "x-signature");
  const xRequestId = getHeader(headers, "x-request-id");
  if (!xSignature || !xRequestId) return { ok: false, reason: "missing_headers" };

  const parsed = parseXSignature(xSignature);
  const ts = parsed.ts;
  const hash = parsed.v1;
  if (!ts || !hash) return { ok: false, reason: "invalid_signature_header" };

  // Mercado Pago builds the manifest using the resource id ("data.id") from the URL.
  const dataIdFromUrl = url?.searchParams?.get("data.id");
  const dataId = dataIdFromUrl || bodyJson?.data?.id || bodyJson?.id;
  if (!dataId) return { ok: false, reason: "missing_data_id" };

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const computed = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

  return {
    ok: timingSafeEqualHex(computed, hash),
    dataId: String(dataId),
  };
}

