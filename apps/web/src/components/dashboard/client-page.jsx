"use client";

import { useCallback, useEffect, useState } from "react";
import { CreditCard, Menu, Sparkles, Store } from "lucide-react";
import Sidebar from "../../components/dashboard/sidebar";
import { getRegions } from "../../app/actions/store-actions/get-actions";
import { getProductsGroupedByChannel } from "../../app/actions/store-actions/products/get-products";
import ProductGridClient from "../../components/dashboard/products/product-grid-client";
import CreateProductForm from "../../components/dashboard/products/form-create-product";
import { SECTIONS } from "../../lib/constans";
import ProfileData from "../../components/dashboard/profile/profile-data";
import SalesChannel from "./stores/store";
import { getMyStores } from "../../app/actions/store-actions/get-my-store";
import BillingSection from "./billing/billing";
import {
  getPrimarySubscription,
  hasStoreAccess,
  subscriptionStatusLabel,
} from "../../lib/subscriptions";

export default function DashboardClientPage({ user, plans }) {
  const [activeSection, setActiveSection] = useState("profile");
  const [productsByStore, setProductsByStore] = useState({});
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState("");

  const activeSubscription = getPrimarySubscription(user?.subscriptions ?? []);
  const storeAccessEnabled = hasStoreAccess(activeSubscription);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);

    try {
      if (!storeAccessEnabled) {
        setStores([]);
        setProductsByStore({});
        return;
      }

      const [regions, myStores] = await Promise.all([getRegions(), getMyStores()]);
      setStores(myStores);

      if (myStores.length > 0) {
        setSelectedStoreId((currentValue) => currentValue || myStores[0].id);
      } else {
        setSelectedStoreId("");
      }

      if (regions.length > 0 && myStores.length > 0) {
        const grouped = await getProductsGroupedByChannel(regions[0].id, myStores);
        setProductsByStore(grouped);
      } else {
        setProductsByStore({});
      }
    } catch (error) {
      console.error("Error cargando informacion del dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, [storeAccessEnabled]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const activeSectionData = SECTIONS.find((section) => section.id === activeSection);
  const showLockedState =
    !storeAccessEnabled &&
    ["stores", "products", "create-product"].includes(activeSection);

  const filteredProductsByStore =
    selectedStoreId && productsByStore[selectedStoreId]
      ? { [selectedStoreId]: productsByStore[selectedStoreId] }
      : productsByStore;

  const renderLoadingState = () => (
    <div className="surface p-8">
      <div className="flex items-center gap-3">
        <div className="inline-flex size-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-slate-50">
          <Sparkles className="size-5 text-[var(--accent)]" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Sincronizando datos</p>
          <p className="text-lg font-semibold text-slate-950">
            Cargando informacion del panel
          </p>
        </div>
      </div>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-[var(--accent)]" />
      </div>
    </div>
  );

  const renderLockedState = () => (
    <section className="surface p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Suscripcion requerida
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">
            Activa un plan para operar tu ecommerce
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Cuando confirmes uno de los cuatro planes disponibles se habilitaran
            la creacion de tiendas, el catalogo multi-tenant y la publicacion de
            storefronts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveSection("billing")}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <CreditCard className="size-4" />
          Elegir plan
        </button>
      </div>
    </section>
  );

  const renderContent = () => {
    if (loading) {
      return renderLoadingState();
    }

    if (showLockedState) {
      return renderLockedState();
    }

    switch (activeSection) {
      case "profile":
        return <ProfileData user={user} />;
      case "stores":
        return (
          <SalesChannel
            hasStoreAccess={storeAccessEnabled}
            stores={stores}
            subscription={activeSubscription}
            onChange={loadDashboardData}
          />
        );
      case "billing":
        return <BillingSection user={user} plans={plans} />;
      case "create-product":
        return (
          <CreateProductForm
            storeId={selectedStoreId}
            stores={stores}
            onSuccess={loadDashboardData}
          />
        );
      case "products":
        return (
          <div className="w-full">
            <ProductGridClient
              productsByStore={filteredProductsByStore}
              onEdit={() => {}}
              onDelete={() => {}}
              onUpdate={() => {}}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="lg:pl-72">
        <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/80 backdrop-blur-xl">
          <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--border)] bg-white text-slate-700 hover:bg-slate-50 lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Abrir menu"
                type="button"
              >
                <Menu className="size-5" />
              </button>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {activeSectionData?.title}
                </p>
                <h1 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">
                  Centro de control
                </h1>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              {storeAccessEnabled && stores.length > 0 ? (
                <label className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-sm text-slate-600">
                  <Store className="size-4 text-slate-400" />
                  <select
                    value={selectedStoreId}
                    onChange={(event) => setSelectedStoreId(event.target.value)}
                    className="bg-transparent text-sm outline-none"
                    aria-label="Seleccionar tienda activa"
                  >
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-sm text-slate-600">
                {user?.email}
              </span>
              <span className="rounded-full bg-slate-950 px-3 py-1.5 text-sm font-medium text-white">
                {stores?.length ?? 0} tiendas
              </span>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {!storeAccessEnabled ? (
            <section className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
              <p className="font-semibold">
                Estado actual: {subscriptionStatusLabel(activeSubscription?.status)}
              </p>
              <p className="mt-1">
                Completa la seleccion de un plan para desbloquear tiendas,
                productos y storefronts multi-tenant.
              </p>
            </section>
          ) : null}

          {renderContent()}
        </main>
      </div>
    </div>
  );
}
