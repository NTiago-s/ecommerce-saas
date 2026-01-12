export default function PricingCard({ title, price, features, highlight }) {
  return (
    <div
      className={`rounded-2xl border p-8 text-center ${
        highlight ? "border-emerald-600 shadow-xl scale-105" : ""
      }`}
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-4 text-4xl font-bold">{price}</p>

      <ul className="mt-6 space-y-2 text-gray-600">
        {features.map((item, i) => (
          <li key={i}>✓ {item}</li>
        ))}
      </ul>

      <button className="mt-8 w-full rounded-lg bg-emerald-600 py-3 text-white hover:bg-emerald-700">
        Elegir plan
      </button>
    </div>
  );
}
