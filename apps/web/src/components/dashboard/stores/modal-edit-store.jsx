"use client";

import { useState } from "react";

export default function ModalEditStore({
  channel,
  onClose,
  onSubmit,
  loading,
  error,
}) {
  const [name, setName] = useState(channel.name);
  const [description, setDescription] = useState(channel.description || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal content */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6 z-10">
        <h3 className="text-lg font-bold mb-1">Editar tienda</h3>
        <p className="text-sm text-gray-500 mb-4">
          Modifica los datos de tu sales channel.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Online Store"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Main ecommerce sales channel"
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              aria-label="Cancelar edición"
              className="flex-1 border rounded-lg py-2 cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              aria-label="Guardar cambios"
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
