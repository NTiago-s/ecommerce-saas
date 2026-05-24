const DEFAULT_MEDUSA_URL = "http://localhost:9000";

function getMedusaUrl() {
  return (
    process.env.SAAS_MEDUSA_URL ||
    process.env.MEDUSA_BACKEND_URL ||
    DEFAULT_MEDUSA_URL
  ).replace(/\/$/, "");
}

function getInternalApiKey() {
  const key = process.env.SAAS_INTERNAL_API_KEY;

  if (!key) {
    throw new Error("SAAS_INTERNAL_API_KEY no está configurada en web.");
  }

  return key;
}

function headers(extraHeaders = {}) {
  return {
    "x-saas-api-key": getInternalApiKey(),
    ...extraHeaders,
  };
}

export function salesChannelHeader(ids = []) {
  return {
    "x-saas-sales-channel-ids": ids.filter(Boolean).join(","),
  };
}

export async function callSaasApi(path, options = {}) {
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const res = await fetch(`${getMedusaUrl()}${path}`, {
    ...options,
    headers: headers({
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Error comunicando con Medusa SaaS.");
  }

  return data;
}
