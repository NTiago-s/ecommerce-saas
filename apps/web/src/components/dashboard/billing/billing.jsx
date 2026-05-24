"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, CreditCard, Store, Box } from "lucide-react";
import Button from "../../../ui/button";
import { startMercadoPagoSubscription } from "../../../app/actions/billing-actions/mercadopago";
import {
  getPrimarySubscription,
  subscriptionStatusLabel,
} from "../../../lib/subscriptions";

function formatPlanPrice(plan) {
  const currency = String(plan?.currency ?? "usd").toUpperCase();
  const price = Number(plan?.price ?? 0);
  if (price === 0) return "Gratis";
  return `${currency} ${price}/mes`;
}

function statusLabel(status) {
  return subscriptionStatusLabel(status);
}

export default function BillingSection({ user, plans }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const activeSub = useMemo(
    () => getPrimarySubscription(user?.subscriptions ?? []),
    [user],
  );

  const currentPlanId = activeSub?.planId ?? activeSub?.plan?.id ?? null;

  async function onChoose(planId) {
    setError("");
    startTransition(async () => {
      try {
        const res = await startMercadoPagoSubscription(planId);
        if (res?.initPoint) {
          window.location.href = res.initPoint;
          return;
        }
        if (res?.redirectTo) {
          window.location.href = res.redirectTo;
          return;
        }
        window.location.reload();
      } catch (e) {
        setError(e?.message || "No se pudo iniciar la suscripcion");
      }
    });
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-gray-500">Plan actual</p>
            <h2 className="mt-1 text-2xl font-semibold text-gray-900">
              {activeSub?.plan?.name || "Sin plan"}
            </h2>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700">
            <CreditCard className="size-4 text-gray-500" aria-hidden="true" />
            {statusLabel(activeSub?.status)}
          </span>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Gestiona tu suscripcion y limites de tiendas desde aca.
        </p>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Planes disponibles</h3>
          <span className="text-sm text-gray-500">{plans?.length ?? 0}</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(plans ?? []).map((plan) => {
            const isCurrent = currentPlanId && plan.id === currentPlanId;
            return (
              <article
                key={plan.id}
                className={`rounded-2xl border p-5 transition ${
                  isCurrent
                    ? "border-blue-600 bg-blue-50/40"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{plan.name}</h4>
                    <p className="mt-1 text-sm text-gray-600">{formatPlanPrice(plan)}</p>
                  </div>
                  {isCurrent ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white">
                      <Check className="size-3.5" aria-hidden="true" />
                      Actual
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Store className="size-4 text-gray-500" aria-hidden="true" />
                    <span>{plan.maxStores ?? "∞"} tiendas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Box className="size-4 text-gray-500" aria-hidden="true" />
                    <span>{plan.maxProducts ?? "∞"} productos</span>
                  </div>
                </div>

                <Button
                  variant={isCurrent ? "outline" : "primary"}
                  size="sm"
                  fullWidth
                  className="mt-4"
                  onClick={() => onChoose(plan.id)}
                  disabled={pending}
                  aria-label={
                    isCurrent
                      ? `Plan actual ${plan.name}`
                      : `Cambiar al plan ${plan.name} con Mercado Pago`
                  }
                >
                  {isCurrent ? "Plan actual" : "Elegir plan"}
                </Button>
              </article>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Mercado Pago abre un checkout alojado para completar el medio de pago.
        </p>
      </section>
    </div>
  );
}
