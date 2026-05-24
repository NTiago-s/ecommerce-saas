const DEFAULT_DOLAR_API_URL = "https://dolarapi.com/v1/dolares/oficial";
const DEFAULT_IVA_RATE = 0.21;

function getIvaRate() {
  const rawValue = String(process.env.MERCADOPAGO_IVA_RATE ?? "").trim();
  if (!rawValue) return DEFAULT_IVA_RATE;

  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error("MERCADOPAGO_IVA_RATE invalido");
  }

  return parsed;
}

function parseOfficialUsdArsResponse(json) {
  const value = Number(json?.venta);

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("DolarAPI: valor de venta invalido");
  }

  return {
    source: "DolarAPI",
    name: String(json?.nombre ?? "Oficial"),
    value,
    date: json?.fechaActualizacion
      ? new Date(json.fechaActualizacion)
      : null,
  };
}

export async function getOfficialUsdArsRate({ fetchImpl = fetch } = {}) {
  const res = await fetchImpl(DEFAULT_DOLAR_API_URL, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`DolarAPI: HTTP ${res.status} ${text}`.trim());
  }

  const json = await res.json();
  return parseOfficialUsdArsResponse(json);
}

export function calculateMercadoPagoArsAmount({
  usdAmount,
  exchangeRate,
  ivaRate = getIvaRate(),
}) {
  const amountUsd = Number(usdAmount);
  const rate = Number(exchangeRate);

  if (!Number.isFinite(amountUsd) || amountUsd < 0) {
    throw new Error("Monto USD invalido");
  }

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error("Cotizacion invalida");
  }

  const subtotal = amountUsd * rate;
  const total = subtotal * (1 + ivaRate);
  const rounded = Math.round(total);

  if (!Number.isFinite(rounded) || rounded <= 0) {
    throw new Error("No se pudo calcular el monto final en ARS");
  }

  return rounded;
}
