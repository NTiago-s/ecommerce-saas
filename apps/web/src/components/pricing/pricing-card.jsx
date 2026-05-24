import Button from "../../ui/button";
import { Box, Check, Gem, Store } from "lucide-react";

function formatPrice(value, currency) {
  if (value === null || value === undefined) return "";
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return String(value);

  const resolvedCurrency = String(currency ?? "").trim();
  try {
    if (resolvedCurrency) {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: resolvedCurrency,
        maximumFractionDigits: 0,
      }).format(numeric);
    }
  } catch {
    // fallback below
  }

  return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(
    numeric,
  );
}

function featureByPlan(name, maxStores, maxProducts) {
  const key = String(name ?? "").toLowerCase();

  if (key === "prueba") {
    return [
      "Ideal para empezar",
      "1 tienda incluida",
      "Sin costo mensual",
    ];
  }

  if (key === "basico") {
    return [
      "Para una operación inicial",
      "1 tienda incluida",
      "30 productos por tienda",
    ];
  }

  if (key === "intermedio") {
    return [
      "Para crecer con orden",
      "3 tiendas incluidas",
      "40 productos por tienda",
    ];
  }

  if (key === "profesional") {
    return [
      "Para operación avanzada",
      "5 tiendas incluidas",
      "Productos ilimitados",
    ];
  }

  return [
    `${maxStores ?? "∞"} tiendas`,
    maxProducts ? `${maxProducts} productos por tienda` : "Productos ilimitados",
    "Gestion centralizada",
  ];
}

export default function PricingCard({
  planId,
  title,
  price,
  currency,
  features,
  maxStores,
  maxProducts,
  highlight,
  badge,
}) {
  const formattedPrice = formatPrice(price, currency);
  const featureItems = featureByPlan(title, maxStores, maxProducts);

  return (
    <article
      className={`relative flex h-full flex-col rounded-[1.5rem] border bg-white p-6 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300 ${
        highlight ? "border-[var(--accent)] ring-1 ring-blue-100" : "border-[var(--border)]"
      }`}
      aria-label={`Plan ${title}`}
    >
      {badge ? (
        <span className="absolute -top-3 left-6 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {badge}
        </span>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">
            {title}
          </h3>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            {formattedPrice}
          </p>
          <p className="mt-1 text-sm text-slate-500">por mes</p>
        </div>

        <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-slate-50">
          <Gem className="size-5 text-[var(--accent)]" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-[var(--border)] bg-slate-50 p-3">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Store className="size-4 text-slate-500" aria-hidden="true" />
          <span>{maxStores ?? "∞"} tiendas</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Box className="size-4 text-slate-500" aria-hidden="true" />
          <span>{maxProducts ?? "∞"} productos</span>
        </div>
      </div>

      <ul className="mt-6 grow space-y-3 text-sm text-slate-700">
        {featureItems.map((item, index) => (
          <li key={`${title}-${index}`} className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 text-emerald-600" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <Button
        variant="primary"
        fullWidth
        className="mt-8"
        href={`/register?plan=${encodeURIComponent(planId)}`}
        aria-label={`Elegir plan ${title}`}
      >
        Elegir plan
      </Button>
    </article>
  );
}

