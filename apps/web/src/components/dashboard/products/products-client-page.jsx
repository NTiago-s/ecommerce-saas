"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductGridClient from "./product-grid-client";
import CreateProductForm from "./form-create-product";
import EditProductForm from "./form-edit-product";

export default function ProductsClientPage({ productsByStore, store, stores }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedStoreId = store?.id;

  // Get all products for the selected store view
  const currentStoreData = productsByStore[selectedStoreId] || {
    store,
    products: [],
  };
  const [productList, setProductList] = useState(currentStoreData.products);

  // Calculate total products across all stores
  const allProducts = Object.values(productsByStore).flatMap(
    (data) => data.products,
  );
  const totalProductCount = allProducts.length;

  const handleProductCreated = (newProduct) => {
    setProductList((prev) => [newProduct, ...prev]);
    setShowCreateForm(false);
    // Refresh page to get updated grouped data
    router.refresh();
  };

  const handleProductUpdated = (updatedProduct) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
    setEditingProduct(null);
    router.refresh();
  };

  const handleProductDeleted = (productId) => {
    setProductList((prev) => prev.filter((p) => p.id !== productId));
    router.refresh();
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
            <p className="text-gray-600 mt-2">
              Gestiona los productos de tus {stores.length} tienda(s) ·{" "}
              {totalProductCount} productos en total
            </p>
          </div>
          <div className="flex items-center gap-3">
            {Array.isArray(stores) && stores.length > 1 && (
              <select
                value={selectedStoreId}
                onChange={(e) => {
                  const nextId = e.target.value;
                  const next = new URLSearchParams(searchParams?.toString());
                  next.set("storeId", nextId);
                  router.push(`/dashboard/products?${next.toString()}`);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => {
                setShowCreateForm(true);
                setEditingProduct(null);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              + Nuevo Producto
            </button>
          </div>
        </div>

        {/* Forms */}
        {showCreateForm && !editingProduct && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Crear Nuevo Producto</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <CreateProductForm
              onSuccess={handleProductCreated}
              storeId={selectedStoreId}
              stores={stores}
            />
          </div>
        )}

        {editingProduct && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Editar Producto</h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <EditProductForm
              product={editingProduct}
              onSuccess={handleProductUpdated}
              storeId={selectedStoreId}
            />
          </div>
        )}

        {/* Products Grid - Grouped by Stores */}
        {!showCreateForm && !editingProduct && (
          <>
            {totalProductCount === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No tienes productos
                </h3>
                <p className="text-gray-600 mb-6">
                  Comienza agregando tu primer producto a las tiendas
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  + Crear Producto
                </button>
              </div>
            ) : (
              <ProductGridClient
                productsByStore={productsByStore}
                onEdit={handleEditProduct}
                onDelete={handleProductDeleted}
                onUpdate={handleProductUpdated}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
