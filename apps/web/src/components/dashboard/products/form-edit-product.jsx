"use client";
import { useState } from "react";
import { updateMedusaProduct } from "../../../app/actions/store-actions/products/update-product";

export default function EditProductForm({ product, onSuccess, storeId }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("Detalles");

  const variant = product.variants?.[0] || {};
  const price = variant.prices?.[0]?.amount || 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const productData = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: formData.get("price"),
      sku: formData.get("sku"),
    };

    const result = await updateMedusaProduct(product.id, productData, storeId);
    setLoading(false);

    if (result.success) {
      setMessage("✅ Producto actualizado");
      onSuccess(result.data);
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center border-b border-gray-200 mb-6">
        {["Detalles", "Precios", "Inventario"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-6 pb-4 text-sm font-medium transition-colors relative ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {activeTab === "Detalles" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del producto
              </label>
              <input
                name="title"
                defaultValue={product.title}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                defaultValue={product.description}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                name="status"
                defaultValue={product.status}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="published">Publicado</option>
                <option value="draft">Borrador</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === "Precios" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={(price / 100).toFixed(2)}
                  className="w-full border border-gray-300 rounded-lg p-3 pl-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "Inventario" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU
              </label>
              <input
                name="sku"
                defaultValue={variant.sku}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gestionar inventario
              </label>
              <select
                name="manage_inventory"
                defaultValue={variant.manage_inventory ? "true" : "false"}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        )}

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.includes("✅")
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => onSuccess(product)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
