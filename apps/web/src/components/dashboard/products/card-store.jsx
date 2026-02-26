"use client";
import { useState } from "react";

export default function ProductCard({ product, onEdit, onDelete }) {
  console.log({ product });

  const variant = product.variants?.[0];
  const rawPrice =
    variant?.calculated_price?.calculated_amount ||
    variant?.prices?.[0]?.amount ||
    0;

  const formattedPrice = rawPrice.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const [showActions, setShowActions] = useState(false);

  const handleToggleStatus = async () => {
    try {
      const response = await fetch(
        `/api/products/${product.id}/toggle-status`,
        {
          method: "PATCH",
        },
      );

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error toggling product status:", error);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este producto?")
    ) {
      await onDelete(product.id);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 mt-6 relative">
      {/* Status Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className={`text-white text-xs px-3 py-1 rounded-full shadow-lg ${
            product.status === "published" ? "bg-green-600" : "bg-gray-600"
          }`}
        >
          {product.status === "published" ? "Activo" : "Inactivo"}
        </span>
      </div>

      {/* Actions Menu */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => setShowActions(!showActions)}
          className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-white transition-colors"
        >
          ⋮
        </button>

        {showActions && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <button
              onClick={() => {
                onEdit(product);
                setShowActions(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              ✏️ Editar
            </button>
            <button
              onClick={handleToggleStatus}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              {product.status === "published" ? "🔒 Desactivar" : "🔓 Activar"}
            </button>
            <button
              onClick={handleDelete}
              className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 transition-colors"
            >
              🗑️ Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Imagen */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={product.thumbnail || "/placeholder.jpg"}
          alt={product.title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
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
