"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Search, Store, Package } from "lucide-react";
import ProductCard from "./card-store";

export default function ProductGridClient({
  productsByStore,
  onEdit,
  onDelete,
  onUpdate,
}) {
  const [selectedStores, setSelectedStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const stores = useMemo(() => {
    if (!productsByStore || typeof productsByStore !== "object") return [];
    return Object.values(productsByStore)
      .map((data) => data.store)
      .filter(Boolean);
  }, [productsByStore]);

  useEffect(() => {
    if (stores.length > 0) {
      setSelectedStores(stores.map((s) => s.id));
    }
  }, [stores]);

  const filteredData = useMemo(() => {
    if (!productsByStore || typeof productsByStore !== "object") return {};

    const result = {};
    Object.entries(productsByStore).forEach(([storeId, storeData]) => {
      if (!selectedStores.includes(storeId)) return;

      const filteredProducts = storeData.products.filter((product) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          product.title?.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term) ||
          product.handle?.toLowerCase().includes(term)
        );
      });

      if (filteredProducts.length > 0) {
        result[storeId] = { store: storeData.store, products: filteredProducts };
      }
    });
    return result;
  }, [productsByStore, selectedStores, searchTerm]);

  const totalProducts = useMemo(
    () =>
      Object.values(filteredData).reduce(
        (sum, data) => sum + data.products.length,
        0,
      ),
    [filteredData],
  );

  if (stores.length === 0) {
    return (
      <section className="surface p-10 text-center text-slate-500">
        No hay tiendas disponibles
      </section>
    );
  }

  const toggleStore = (storeId) => {
    setSelectedStores((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId],
    );
  };

  return (
    <div className="space-y-6">
      <section className="surface p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-[var(--border)] bg-slate-50 px-11 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-600">
              Filtrar por tienda:
            </span>
            <button
              onClick={() => setSelectedStores(stores.map((s) => s.id))}
              className="rounded-full px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
              type="button"
            >
              Seleccionar todas
            </button>
            <button
              onClick={() => setSelectedStores([])}
              className="rounded-full px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
              type="button"
            >
              Limpiar
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => toggleStore(store.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
                selectedStores.includes(store.id)
                  ? "border-blue-200 bg-blue-50 text-slate-950"
                  : "border-[var(--border)] bg-white text-slate-600 hover:bg-slate-50"
              }`}
              type="button"
            >
              {selectedStores.includes(store.id) ? (
                <Check className="size-4 text-[var(--accent)]" />
              ) : (
                <Store className="size-4 text-slate-400" />
              )}
              {store.name}
              <span className="text-xs text-slate-400">
                ({productsByStore[store.id]?.products?.length || 0})
              </span>
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Mostrando {totalProducts} producto(s) de {selectedStores.length} tienda(s)
        </p>
      </section>

      {Object.entries(filteredData).length === 0 ? (
        <section className="surface p-10 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-50">
            <Package className="size-7 text-[var(--accent)]" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-950">
            No se encontraron productos
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : "Selecciona al menos una tienda para ver productos"}
          </p>
        </section>
      ) : (
        <div className="space-y-8">
          {Object.entries(filteredData).map(([storeId, storeData]) => (
            <section key={storeId} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex size-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-white">
                  <Store className="size-5 text-[var(--accent)]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                    {storeData.store?.name || "Tienda"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {storeData.products.length} producto(s)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {storeData.products.map((product) => (
                  <ProductCard
                    key={`${product.id}-${product.status}`}
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    storeId={storeId}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

