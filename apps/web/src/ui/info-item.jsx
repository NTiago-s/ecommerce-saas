export default function InfoItem({ label, value, badge = false }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      {badge ? (
        <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
          {value}
        </span>
      ) : (
        <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
      )}
    </div>
  );
}

