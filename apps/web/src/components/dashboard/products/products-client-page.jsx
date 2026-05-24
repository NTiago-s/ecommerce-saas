"use client";

import { useEffect, useMemo, useState } from "react";
import { Package } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductGridClient from "./product-grid-client";
import CreateProductForm from "./form-create-product";
import EditProductForm from "./form-edit-product";

export default function ProductsClientPage({ productsByStore, store, stores }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productList, setProductList] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedStoreId = store?.id;

  const currentStoreData = useMemo(
    () => productsByStore?.[selectedStoreId] || { store, products: [] },
    [productsByStore, selectedStoreId, store],
  );

  useEffect(() => {
    setProductList(currentStoreData.products || []);
  }, [currentStoreData]);

  const totalProductCount = useMemo(
    () =>
      Object.values(productsByStore || {}).reduce(
        (sum, data) => sum + (data?.products?.length || 0),
        0,
      ),
    [productsByStore],
  );

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
    <div className="space-y-6">
      <section className="surface flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Productos
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Catálogo y edición
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Gestiona los productos de tus {stores.length} tienda(s) ·{" "}
            {totalProductCount} productos en total
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {Array.isArray(stores) && stores.length > 1 ? (
            <select
              value={selectedStoreId}
              onChange={(e) => {
                const nextId = e.target.value;
                const next = new URLSearchParams(searchParams?.toString());
                next.set("storeId", nextId);
                router.push(`/dashboard/products?${next.toString()}`);
              }}
              className="rounded-full border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-slate-700"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          ) : null}

          <button
            onClick={() => {
              setShowCreateForm(true);
              setEditingProduct(null);
            }}
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            type="button"
          >
            + Nuevo producto
          </button>
        </div>
      </section>

      {showCreateForm && !editingProduct ? (
        <section className="surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">
              Crear nuevo producto
            </h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className="rounded-full px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              type="button"
            >
              ×
            </button>
          </div>
          <CreateProductForm
            onSuccess={handleProductCreated}
            storeId={selectedStoreId}
            stores={stores}
          />
        </section>
      ) : null}

      {editingProduct ? (
        <section className="surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">
              Editar producto
            </h2>
            <button
              onClick={() => setEditingProduct(null)}
              className="rounded-full px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              type="button"
            >
              ×
            </button>
          </div>
          <EditProductForm
            product={editingProduct}
            onSuccess={handleProductUpdated}
            storeId={selectedStoreId}
          />
        </section>
      ) : null}

      {!showCreateForm && !editingProduct ? (
        totalProductCount === 0 ? (
          <section className="surface p-10 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-50">
              <Package className="size-7 text-[var(--accent)]" />
            </div>
            <h3 className="mt-4 text-xl font-medium text-slate-950">
              No tienes productos
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Comienza agregando tu primer producto al catálogo.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-6 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
              type="button"
            >
              + Crear producto
            </button>
          </section>
        ) : (
          <ProductGridClient
            key={JSON.stringify(
              productList.map((p) => ({ id: p.id, status: p.status })),
            )}
            productsByStore={{
              [selectedStoreId]: {
                store: currentStoreData.store,
                products: productList,
              },
            }}
            onEdit={handleEditProduct}
            onDelete={handleProductDeleted}
            onUpdate={handleProductUpdated}
          />
        )
      ) : null}
    </div>
  );
}

