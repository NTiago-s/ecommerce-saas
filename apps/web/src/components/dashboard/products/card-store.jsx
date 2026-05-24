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
  const priceNumber = typeof rawPrice === "number" ? rawPrice : Number(rawPrice) || 0;
  const priceInUnits = priceNumber / 100;
  const formattedPrice = priceInUnits.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const [showActions, setShowActions] = useState(false);

  const handleToggleStatus = async () => {
    const newStatus = product.status === "published" ? "draft" : "published";
    const updatedProduct = { ...product, status: newStatus };

    if (typeof onUpdate === "function") onUpdate(updatedProduct);

    try {
      const result = await toggleProductStatus(product.id, storeId);
      if (!result.success) throw new Error(result.error || "No se pudo cambiar el estado");
      if (typeof onUpdate === "function") onUpdate(result.data);
    } catch (error) {
      console.error("Error toggling product status:", error);
      if (typeof onUpdate === "function") onUpdate(product);
    } finally {
      setShowActions(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return;
    }

    try {
      const result = await deleteMedusaProduct(product.id, storeId);
      if (!result.success) throw new Error(result.error || "No se pudo eliminar el producto");
      if (typeof onDelete === "function") onDelete(product.id);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <article
      className="surface group relative overflow-hidden"
      aria-label={`Producto: ${product.title} - Precio: ${formattedPrice} - Estado: ${
        product.status === "published" ? "Activo" : "Inactivo"
      }`}
    >
      <div className="absolute left-4 top-4 z-10">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
            product.status === "published"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {product.status === "published" ? "Activo" : "Inactivo"}
        </span>
      </div>

      <div className="absolute right-4 top-4 z-10">
        <button
          onClick={() => setShowActions((value) => !value)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--border)] bg-white text-slate-700 shadow-sm hover:bg-slate-50"
          aria-label="Abrir menú de acciones del producto"
          aria-expanded={showActions}
          aria-haspopup="menu"
          type="button"
        >
          <MoreVertical className="size-5" aria-hidden="true" />
        </button>

        {showActions ? (
          <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-1 shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
            <button
              onClick={() => {
                onEdit(product);
                setShowActions(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
              type="button"
            >
              <Pencil className="size-4" aria-hidden="true" />
              Editar
            </button>
            <button
              onClick={handleToggleStatus}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
              type="button"
            >
              {product.status === "published" ? (
                <Lock className="size-4" aria-hidden="true" />
              ) : (
                <Unlock className="size-4" aria-hidden="true" />
              )}
              {product.status === "published" ? "Desactivar" : "Activar"}
            </button>
            <button
              onClick={handleDelete}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              type="button"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Eliminar
            </button>
          </div>
        ) : null}
      </div>

      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img
          src={product.thumbnail || "/placeholder.jpg"}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="p-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-950">
          {product.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
          {product.description || "Sin descripción disponible."}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-lg font-semibold text-[var(--accent)]">
            {formattedPrice}
          </span>
          <button
            onClick={() => router.push(`/dashboard/${product.id}?storeId=${storeId}`)}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            type="button"
          >
            Ver más
          </button>
        </div>
      </div>
    </article>
  );
}

