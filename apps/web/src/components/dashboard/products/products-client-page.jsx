"use client";
import { useState } from "react";
import ProductGridClient from "./product-grid-client";
import CreateProductForm from "./form-create-product-new";
import EditProductForm from "./form-edit-product";

export default function ProductsClientPage({ products, store }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productList, setProductList] = useState(products);

  const handleProductCreated = (newProduct) => {
    setProductList((prev) => [newProduct, ...prev]);
    setShowCreateForm(false);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
    setEditingProduct(null);
  };

  const handleProductDeleted = (productId) => {
    setProductList((prev) => prev.filter((p) => p.id !== productId));
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
              Gestiona los productos de tu tienda "{store.name}"
            </p>
          </div>
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
            <CreateProductForm onSuccess={handleProductCreated} />
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
            />
          </div>
        )}

        {/* Products Grid */}
        {!showCreateForm && !editingProduct && (
          <>
            {productList.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No tienes productos
                </h3>
                <p className="text-gray-600 mb-6">
                  Comienza agregando tu primer producto a la tienda
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  + Crear Producto
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Mostrando {productList.length} producto(s)
                  </p>
                </div>
                <ProductGridClient
                  products={productList}
                  onEdit={handleEditProduct}
                  onDelete={handleProductDeleted}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
