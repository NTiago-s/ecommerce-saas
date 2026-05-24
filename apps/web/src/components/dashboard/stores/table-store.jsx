"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Globe, Pencil, Power } from "lucide-react";
import { getSalesChannels } from "../../../app/actions/store-actions/sales-channels/get-sale-channels";
import { updateSalesChannel } from "../../../app/actions/store-actions/sales-channels/update-sale-channels";
import { toggleSalesChannelStatus } from "../../../app/actions/store-actions/sales-channels/toggle-sale-channels";
import { buildStorefrontUrl } from "../../../lib/storefront-url";
import ModalEditStore from "./modal-edit-store";

export default function TableStore({ stores = [], onChange }) {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingChannel, setEditingChannel] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [toggleLoading, setToggleLoading] = useState(null);

  const loadChannels = async () => {
    try {
      const data = await getSalesChannels();
      setChannels(data);
    } catch (err) {
      setError(err.message || "Error cargando tiendas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChannels();
  }, []);

  const tenantStores = useMemo(() => {
    const channelMap = new Map(
      channels.map((channel) => [channel.id, channel]),
    );

    return stores.map((store) => {
      const channel = channelMap.get(store.medusaSalesChannelId);

      return {
        ...store,
        channel,
        isDisabled: Boolean(channel?.is_disabled),
        description: channel?.description || "",
      };
    });
  }, [channels, stores]);

  const handleEdit = (channel) => {
    if (!channel) return;
    setEditingChannel(channel);
    setEditError("");
  };

  const handleEditSubmit = async ({ name, description }) => {
    setEditLoading(true);
    setEditError("");

    try {
      await updateSalesChannel({
        channelId: editingChannel.id,
        name,
        description,
      });

      await loadChannels();
      setEditingChannel(null);

      if (typeof onChange === "function") {
        await onChange();
      }
    } catch (err) {
      setEditError(err.message || "Error actualizando la tienda");
    } finally {
      setEditLoading(false);
    }
  };

  const handleToggleStatus = async (channel) => {
    if (!channel) return;

    setToggleLoading(channel.id);

    try {
      await toggleSalesChannelStatus({
        channelId: channel.id,
        isDisabled: !channel.is_disabled,
      });

      await loadChannels();

      if (typeof onChange === "function") {
        await onChange();
      }
    } catch (err) {
      setError(err.message || "Error modificando el estado de la tienda");
    } finally {
      setToggleLoading(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Cargando tiendas...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!tenantStores.length) {
    return (
      <section className="rounded-3xl border border-dashed border-[var(--border)] bg-white p-10 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-50">
          <Globe className="size-7 text-[var(--accent)]" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-950">
          Tu espacio multi-tenant esta vacio
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Crea tu primera tienda para publicar catalogo, operar con Medusa y
          abrir una URL propia basada en slug.
        </p>
      </section>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tenantStores.map((store) => (
          <div
            key={store.id}
            className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">
                  {store.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">/{store.subdomain}</p>
              </div>

              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  store.isDisabled
                    ? "bg-red-100 text-red-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {store.isDisabled ? "Pausada" : "Publicable"}
              </span>
            </div>

            {store.description ? (
              <p className="mb-4 text-sm text-slate-600">{store.description}</p>
            ) : null}

            <div className="grid gap-2 rounded-2xl border border-[var(--border)] bg-slate-50 p-4 text-sm text-slate-700">
              <p>
                <span className="font-medium text-slate-900">Slug:</span>{" "}
                {store.subdomain}
              </p>
              <p>
                <span className="font-medium text-slate-900">Creada:</span>{" "}
                {new Date(store.createdAt).toLocaleDateString("es-AR")}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={buildStorefrontUrl(store.subdomain)}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-950"
              >
                <ExternalLink className="size-4" />
                Ver storefront
              </a>
              <button
                onClick={() => handleEdit(store.channel)}
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline disabled:opacity-50"
                disabled={!store.channel}
              >
                <Pencil className="size-4" />
                Editar
              </button>
              <button
                onClick={() => handleToggleStatus(store.channel)}
                disabled={toggleLoading === store.channel?.id || !store.channel}
                className="inline-flex cursor-pointer items-center gap-2 text-sm text-red-600 hover:underline disabled:opacity-50"
              >
                <Power className="size-4" />
                {toggleLoading === store.channel?.id
                  ? "Procesando..."
                  : store.isDisabled
                    ? "Habilitar"
                    : "Deshabilitar"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingChannel ? (
        <ModalEditStore
          channel={editingChannel}
          onClose={() => setEditingChannel(null)}
          onSubmit={handleEditSubmit}
          loading={editLoading}
          error={editError}
        />
      ) : null}
    </>
  );
}
