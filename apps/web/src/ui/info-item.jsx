export default function InfoItem({ label, value, badge = false }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>

      {badge ? (
        <span className="inline-block mt-1 px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
          {value}
        </span>
      ) : (
        <p className="font-medium text-gray-800">{value}</p>
      )}
    </div>
  );
}
