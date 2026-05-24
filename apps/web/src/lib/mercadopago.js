function requireEnv(name) {
  const val = process.env[name];
  if (!val || !String(val).trim()) {
    throw new Error(`${name} no configurado`);
  }
  return String(val).trim();
}

function mpHeaders() {
  const token = requireEnv("MERCADOPAGO_ACCESS_TOKEN");
  return {
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
    accept: "application/json",
  };
}

async function mpFetch(path, { method = "GET", body } = {}) {
  const res = await fetch(`https://api.mercadopago.com${path}`, {
    method,
    headers: mpHeaders(),
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const text = await res.text().catch(() => "");
  const json = text ? safeJsonParse(text) : null;

  if (!res.ok) {
    const msg =
      json?.message ||
      json?.error ||
      (typeof text === "string" && text.trim() ? text.trim() : null) ||
      `HTTP ${res.status}`;
    throw new Error(`Mercado Pago: ${msg}`);
  }

  return json ?? {};
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function mpCreatePreapprovalPlan({
  reason,
  transaction_amount,
  currency_id = "ARS",
  frequency = 1,
  frequency_type = "months",
  back_url,
}) {
  if (!reason) throw new Error("Mercado Pago: reason requerido");
  if (!transaction_amount || Number(transaction_amount) <= 0) {
    throw new Error("Mercado Pago: transaction_amount invalido");
  }
  if (!back_url) throw new Error("Mercado Pago: back_url requerido");

  return mpFetch("/preapproval_plan", {
    method: "POST",
    body: {
      reason,
      auto_recurring: {
        frequency,
        frequency_type,
        transaction_amount,
        currency_id,
      },
      back_url,
    },
  });
}

export async function mpUpdatePreapprovalPlan(planId, {
  reason,
  transaction_amount,
  currency_id = "ARS",
}) {
  const id = String(planId ?? "").trim();
  if (!id) throw new Error("Mercado Pago: planId invalido");

  return mpFetch(`/preapproval_plan/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: {
      ...(reason ? { reason } : {}),
      ...(transaction_amount
        ? {
            auto_recurring: {
              transaction_amount,
              currency_id,
            },
          }
        : {}),
    },
  });
}

export async function mpCreatePreapproval({
  preapproval_plan_id,
  reason,
  card_token_id,
  payer_email,
  auto_recurring,
  back_url,
  notification_url,
  external_reference,
  status,
}) {
  if (!payer_email) throw new Error("Mercado Pago: payer_email requerido");
  if (!preapproval_plan_id && !reason) {
    throw new Error("Mercado Pago: reason requerido sin plan asociado");
  }
  if (!preapproval_plan_id && !auto_recurring) {
    throw new Error("Mercado Pago: auto_recurring requerido sin plan asociado");
  }

  return mpFetch("/preapproval", {
    method: "POST",
    body: {
      ...(preapproval_plan_id ? { preapproval_plan_id } : {}),
      ...(reason ? { reason } : {}),
      payer_email,
      ...(card_token_id ? { card_token_id } : {}),
      ...(auto_recurring ? { auto_recurring } : {}),
      ...(back_url ? { back_url } : {}),
      ...(notification_url ? { notification_url } : {}),
      ...(external_reference ? { external_reference } : {}),
      ...(status ? { status } : {}),
    },
  });
}

export async function mpGetPreapproval(preapprovalId) {
  const id = String(preapprovalId ?? "").trim();
  if (!id) throw new Error("Mercado Pago: preapprovalId invalido");
  return mpFetch(`/preapproval/${encodeURIComponent(id)}`, { method: "GET" });
}
