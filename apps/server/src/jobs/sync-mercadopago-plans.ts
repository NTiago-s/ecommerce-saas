function requireEnv(name: string) {
  const val = process.env[name];
  if (!val || !val.trim()) {
    throw new Error(`${name} no configurado`);
  }
  return val.trim();
}

export default async function syncMercadoPagoPlansJob(_container: any) {
  const baseUrl = requireEnv("SAAS_WEB_BASE_URL");
  const apiKey = requireEnv("SAAS_INTERNAL_API_KEY");

  const url =
    baseUrl.replace(/\/$/, "") +
    "/api/internal/billing/mercadopago/sync-plans";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    // Medusa will log thrown errors.
    throw new Error(`Billing sync fallo: HTTP ${res.status} ${text}`.trim());
  }
}

export const config = {
  name: "sync-mercadopago-plans",
  schedule: "0 * * * *", // Every hour
};
