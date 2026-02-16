"use client";

export default function ModalCreateStore({
  subdomain,
  setSubdomain,
  onClose,
  onSubmit,
  name,
  setName,
  description,
  setDescription,
  enabled,
  setEnabled,
  loading,
  error,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal content */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6 z-10">
        <h3 className="text-lg font-bold mb-1">Crear tienda</h3>
        <p className="text-sm text-gray-500 mb-4">
          Crea un nuevo sales channel para vender productos.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subdominio</label>
            <input
              type="text"
              required
              value={subdomain}
              onChange={(e) =>
                setSubdomain(e.target.value.toLowerCase().replace(/\s+/g, "-"))
              }
              className="w-full border rounded-lg px-3 py-2"
              placeholder="mi-tienda"
            />
            <p className="text-xs text-gray-400 mt-1">
              URL: {subdomain}.tuplataforma.com
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="h-4 w-4 cursor-pointer"
            />
            <span className="text-sm">Enabled</span>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              aria-label="Cancelar creación de tienda"
              className="flex-1 border rounded-lg py-2 cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              aria-label="Crear tienda"
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Creando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
