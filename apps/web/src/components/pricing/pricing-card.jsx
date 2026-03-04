// import Button from "@/ui/button";
import Button from "../../ui/button";
import { Check } from "lucide-react";

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
    // ignore and fallback
  }

  return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(
    numeric,
  );
}

function normalizeFeatures(features) {
  if (Array.isArray(features)) {
    return features.map((item) => String(item));
  }

  if (features && typeof features === "object") {
    return Object.values(features).map((item) => String(item));
  }

  return [];
}

export default function PricingCard({
  title,
  price,
  currency,
  features,
  highlight,
  badge,
}) {
  const featureItems = normalizeFeatures(features);
  const formattedPrice = formatPrice(price, currency);

  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white p-8 text-center shadow-sm transition hover:shadow-md ${
        highlight
          ? "border-emerald-600 ring-1 ring-emerald-200"
          : "border-gray-200"
      }`}
    >
      {/* BADGE */}
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1 text-sm font-semibold text-white">
          {badge}
        </span>
      )}

      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-4 text-4xl font-bold text-gray-900">{formattedPrice}</p>
      <p className="mt-2 text-sm text-gray-500">por mes</p>

      {/* FEATURES */}
      <ul className="mt-6 grow space-y-3 text-left text-sm text-gray-700">
        {featureItems.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 text-emerald-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* BOTÓN SIEMPRE ABAJO */}
      <Button variant="primary" fullWidth className="mt-8" href="/register">
        Elegir plan
      </Button>
    </div>
  );
}
