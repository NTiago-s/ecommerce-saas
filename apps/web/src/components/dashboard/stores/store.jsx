"use client";

import { useState } from "react";
import { createSalesChannel } from "../../../app/actions/store-actions/sales-channels/create-sale-channels";
import ModalCreateStore from "./modal-create-store";
import TableStore from "./table-store";

export default function SalesChannel() {
  const [open, setOpen] = useState(false);
  const [subdomain, setSubdomain] = useState("");

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [enabled, setEnabled] = useState(true);

  // ui state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createSalesChannel({ name, description, enabled, subdomain });
      alert("Sales channel creado ✅");

      // reset
      setName("");
      setDescription("");
      setEnabled(true);
      setOpen(false);
      setSubdomain("");
    } catch (err) {
      setError(err.message || "Error creando el sales channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Tiendas / Sales Channels</h2>

        <button
          onClick={() => setOpen(true)}
          aria-label="Crear tienda"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer "
        >
          Crear tienda
        </button>
      </div>

      <TableStore />

      {open && (
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
      )}
    </>
  );
}
