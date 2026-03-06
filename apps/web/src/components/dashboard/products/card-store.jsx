"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Trash2, Lock, Unlock } from "lucide-react";
import {
  deleteMedusaProduct,
  toggleProductStatus,
} from "../../../app/actions/store-actions/products/delete-product";

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onUpdate,
  storeId,
}) {
  const router = useRouter();
  const variant = product.variants?.[0];
  const rawPrice =
    variant?.calculated_price?.calculated_amount ||
    variant?.prices?.[0]?.amount ||
    0;

  const priceNumber =
    typeof rawPrice === "number" ? rawPrice : Number(rawPrice) || 0;
  const priceInUnits = priceNumber / 100;

  const formattedPrice = priceInUnits.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const [showActions, setShowActions] = useState(false);

  const handleToggleStatus = async () => {
    try {
      const result = await toggleProductStatus(product.id, storeId);

      if (result.success) {
        if (typeof onUpdate === "function") {
          onUpdate({
            ...product,
            status: product.status === "published" ? "draft" : "published",
          });
        }
      } else {
        console.error("Error toggling product status:", result.error);
      }
    } catch (error) {
      console.error("Error toggling product status:", error);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este producto?")
    ) {
      try {
        const result = await deleteMedusaProduct(product.id, storeId);

        if (!result.success) {
          throw new Error(result.error || "No se pudo eliminar el producto");
        }

        if (typeof onDelete === "function") {
          onDelete(product.id);
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <article
      className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 mt-6 relative"
      aria-label={`Producto: ${product.title} - Precio: ${formattedPrice} - Estado: ${product.status === "published" ? "Activo" : "Inactivo"}`}
    >
      {/* Status Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className={`text-white text-xs px-3 py-1 rounded-full shadow-lg ${
            product.status === "published" ? "bg-green-600" : "bg-gray-600"
          }`}
          role="status"
          aria-label={`Estado del producto: ${
            product.status === "published" ? "Activo" : "Inactivo"
          }`}
        >
          {product.status === "published" ? "Activo" : "Inactivo"}
        </span>
      </div>

      {/* Actions Menu */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => setShowActions(!showActions)}
          className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Abrir menú de acciones del producto"
          aria-expanded={showActions}
          aria-haspopup="menu"
          type="button"
        >
          <MoreVertical className="size-5 text-gray-700" aria-hidden="true" />
        </button>

        {showActions && (
          <div
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20"
            role="menu"
            aria-label="Acciones del producto"
          >
            <button
              onClick={() => {
                onEdit(product);
                setShowActions(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              role="menuitem"
              aria-label="Editar producto"
              type="button"
            >
              <span className="flex items-center gap-2">
                <Pencil className="size-4 text-gray-600" aria-hidden="true" />
                Editar
              </span>
            </button>
            <button
              onClick={handleToggleStatus}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              role="menuitem"
              aria-label={`${
                product.status === "published" ? "Desactivar" : "Activar"
              } producto`}
              type="button"
            >
              <span className="flex items-center gap-2">
                {product.status === "published" ? (
                  <Lock className="size-4 text-gray-600" aria-hidden="true" />
                ) : (
                  <Unlock className="size-4 text-gray-600" aria-hidden="true" />
                )}
                {product.status === "published" ? "Desactivar" : "Activar"}
              </span>
            </button>
            <button
              onClick={handleDelete}
              className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset"
              role="menuitem"
              aria-label="Eliminar producto permanentemente"
              type="button"
            >
              <span className="flex items-center gap-2">
                <Trash2 className="size-4" aria-hidden="true" />
                Eliminar
              </span>
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
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Contenido */}
      <div className="p-6">
        <header>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {product.title}
          </h2>
        </header>

        <p
          className="text-gray-500 text-sm h-12 overflow-hidden"
          aria-label={`Descripción: ${product.description || "Sin descripción disponible"}`}
        >
          {product.description || "Sin descripción disponible."}
        </p>

        <div className="flex justify-between items-center mt-6">
          <span
            className="text-xl font-bold text-blue-600"
            aria-label={`Precio: ${formattedPrice}`}
          >
            {formattedPrice}
          </span>

          <button
            onClick={() =>
              router.push(`/dashboard/${product.id}?storeId=${storeId}`)
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Ver detalles completos del producto"
          >
            Ver más
          </button>
        </div>
      </div>
    </article>
  );
}
