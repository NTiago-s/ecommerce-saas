"use client";
import { createMedusaProduct } from "../../../app/actions/store-actions/products/create-products";
import { useState } from "react";

export default function CreateProductForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = Object.fromEntries(new FormData(e.target));

    const result = await createMedusaProduct(formData);

    setLoading(false);
    if (result.success) {
      setMessage("✅ ¡Producto creado con éxito!");
      e.target.reset();
    } else {
      setMessage("❌ Error: " + result.error);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Crear Nuevo Producto
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Título del Producto
          </label>
          <input
            name="title"
            type="text"
            required
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Ej: Camiseta de Algodón"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            name="description"
            className="w-full mt-1 p-2 border rounded-md"
            rows="3"
            placeholder="Describe tu producto..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Precio (USD)
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              required
              className="w-full mt-1 p-2 border rounded-md"
              placeholder="19.99"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Inventario Inicial
            </label>
            <input
              name="inventory"
              type="number"
              required
              className="w-full mt-1 p-2 border rounded-md"
              placeholder="10"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Guardando..." : "Publicar Producto"}
        </button>

        {message && (
          <p className="text-center mt-4 font-medium text-sm">{message}</p>
        )}
      </form>
    </div>
  );
}
