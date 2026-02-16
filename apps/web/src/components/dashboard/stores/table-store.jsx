"use client";

import { useEffect, useState } from "react";
import { getSalesChannels } from "../../../app/actions/store-actions/sales-channels/get-sale-channels";

export default function TableStore() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadChannels() {
      try {
        const data = await getSalesChannels();
        setChannels(data);
      } catch (err) {
        setError(err.message || "Error cargando tiendas");
      } finally {
        setLoading(false);
      }
    }

    loadChannels();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Cargando tiendas...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!channels.length) {
    return (
      <p className="text-sm text-gray-500">No tenés tiendas creadas todavía.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {channels.map((channel) => (
        <div
          key={channel.id}
          className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold">{channel.name}</h3>

            <span
              className={`text-xs px-2 py-1 rounded-full ${
                channel.is_disabled
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {channel.is_disabled ? "Deshabilitada" : "Activa"}
            </span>
          </div>

          {channel.description && (
            <p className="text-sm text-gray-600 mb-4">{channel.description}</p>
          )}

          <p className="text-xs text-gray-400">
            Creada el {new Date(channel.created_at).toLocaleDateString()}
          </p>

          {/* acciones futuras */}
          <div className="flex gap-3 mt-4">
            <button className="text-sm text-blue-600 hover:underline">
              Editar
            </button>
            <button className="text-sm text-red-600 hover:underline">
              Deshabilitar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
