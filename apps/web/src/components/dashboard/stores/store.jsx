"use client";

import { useState } from "react";
import { Plus, Store } from "lucide-react";
import { createSalesChannel } from "../../../app/actions/store-actions/sales-channels/create-sale-channels";
import ModalCreateStore from "./modal-create-store";
import TableStore from "./table-store";

export default function SalesChannel({
  hasStoreAccess,
  stores = [],
  subscription,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [subdomain, setSubdomain] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const maxStores = subscription?.plan?.maxStores ?? 0;
  const remainingStores = maxStores ? Math.max(maxStores - stores.length, 0) : null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createSalesChannel({ name, description, enabled, subdomain });
      setName("");
      setDescription("");
      setEnabled(true);
      setOpen(false);
      setSubdomain("");

      if (typeof onChange === "function") {
        await onChange();
      }
    } catch (err) {
      setError(err.message || "Error creando la tienda");
    } finally {
      setLoading(false);
    }
  };

  if (!hasStoreAccess) {
    return (
      <section className="surface p-8">
        <p className="text-sm font-medium text-slate-500">Acceso bloqueado</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
          Activa un plan para crear tiendas
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          La creacion de tenants y la publicacion del storefront quedan
          habilitadas cuando tu suscripcion pasa a estado activo o de prueba.
        </p>
      </section>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Tenants
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Tus tiendas publicables
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Gestiona slugs, disponibilidad y acceso al storefront de cada
            ecommerce.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <Store className="size-4 text-[var(--accent)]" />
            {stores.length} / {maxStores || "∞"} tiendas
          </span>

          {remainingStores !== null ? (
            <span className="rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
              {remainingStores} disponibles
            </span>
          ) : null}

          <button
            onClick={() => setOpen(true)}
            aria-label="Crear tienda"
            disabled={remainingStores === 0}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="size-4" />
            Crear tienda
          </button>
        </div>
      </div>

      <TableStore stores={stores} onChange={onChange} />

      {open ? (
        <ModalCreateStore
          subdomain={subdomain}
          setSubdomain={setSubdomain}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          enabled={enabled}
          setEnabled={setEnabled}
          loading={loading}
          error={error}
        />
      ) : null}
    </>
  );
}
