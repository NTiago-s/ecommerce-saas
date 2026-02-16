"use client";

export default function ProductCard({ product }) {
  const variant = product.variants?.[0];
  const rawPrice =
    variant?.calculated_price?.calculated_amount ||
    variant?.prices?.[0]?.amount ||
    0;

  const formattedPrice = rawPrice.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 mt-6 ">
      {/* Imagen */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={product.thumbnail || "/placeholder.jpg"}
          alt={product.title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />

        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">
          Nuevo
        </span>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {product.title}
        </h2>

        <p className="text-gray-500 text-sm h-12 overflow-hidden">
          {product.description || "Sin descripción disponible."}
        </p>

        <div className="flex justify-between items-center mt-6">
          <span className="text-xl font-bold text-blue-600">
            {formattedPrice}
          </span>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow cursor-pointer">
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
}
