"use client";

import { useState, useMemo, useEffect } from "react";
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

  // Get all stores from productsByStore
  const stores = useMemo(() => {
    if (!productsByStore || typeof productsByStore !== "object") return [];
    return Object.values(productsByStore)
      .map((data) => data.store)
      .filter(Boolean);
  }, [productsByStore]);

  // Initialize selected stores to all stores on first render
  useEffect(() => {
    if (stores.length > 0 && selectedStores.length === 0) {
      setSelectedStores(stores.map((s) => s.id));
    }
  }, [stores, selectedStores.length]);

  // Filter products by selected stores and search term
  const filteredData = useMemo(() => {
    if (!productsByStore || typeof productsByStore !== "object") return {};

    const result = {};

    Object.entries(productsByStore).forEach(([storeId, storeData]) => {
      // Skip if store not selected
      if (!selectedStores.includes(storeId)) return;

      // Filter products by search term
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
        result[storeId] = {
          store: storeData.store,
          products: filteredProducts,
        };
      }
    });

    return result;
  }, [productsByStore, selectedStores, searchTerm]);

  const toggleStore = (storeId) => {
    setSelectedStores((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId],
    );
  };

  const selectAllStores = () => {
    setSelectedStores(stores.map((s) => s.id));
  };

  const deselectAllStores = () => {
    setSelectedStores([]);
  };

  const totalProducts = useMemo(() => {
    return Object.values(filteredData).reduce(
      (sum, data) => sum + data.products.length,
      0,
    );
  }, [filteredData]);

  // If no stores/products
  if (stores.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No hay tiendas disponibles
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 size-5 text-gray-400" />
            </div>
          </div>

          {/* Store Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-gray-700">
              Filtrar por tienda:
            </span>
            <button
              onClick={selectAllStores}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Seleccionar todas
            </button>
            <button
              onClick={deselectAllStores}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Store Chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => toggleStore(store.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedStores.includes(store.id)
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
              }`}
            >
              <span className="flex items-center gap-2">
                {selectedStores.includes(store.id) ? (
                  <Check className="size-4" />
                ) : null}
                {store.name}
                <span className="text-xs opacity-75">
                  ({productsByStore[store.id]?.products?.length || 0})
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mt-4">
          Mostrando {totalProducts} producto(s) de {selectedStores.length}{" "}
          tienda(s)
        </p>
      </div>

      {/* Products by Store */}
      {Object.entries(filteredData).length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50">
            <Package className="size-7 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : "Selecciona al menos una tienda para ver productos"}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(filteredData).map(([storeId, storeData]) => (
            <div key={storeId} className="space-y-4">
              {/* Store Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Store className="size-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {storeData.store?.name || "Tienda"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {storeData.products.length} producto(s)
                  </p>
                </div>
              </div>

              {/* Products Grid for this Store */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {storeData.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    storeId={storeId}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
