export default function PricingCard({
  title,
  price,
  features,
  highlight,
  badge,
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 text-center transition ${
        highlight ? "border-emerald-600 shadow-xl scale-105" : ""
      }`}
    >
      {/* BADGE */}
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1 text-sm font-semibold text-white">
          {badge}
        </span>
      )}

      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-4 text-4xl font-bold">{price}</p>

      {/* FEATURES */}
      <ul className="mt-6 grow space-y-2 text-gray-600">
        {features.map((item, i) => (
          <li key={i}>✓ {item}</li>
        ))}
      </ul>

      {/* BOTÓN SIEMPRE ABAJO */}
      <button className="mt-8 w-full cursor-pointer rounded-lg bg-emerald-600 py-3 text-white hover:bg-emerald-700">
        Elegir plan
      </button>
    </div>
  );
}
