"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../../components/dashboard/sidebar";
import { getRegions } from "../../app/actions/store-actions/get-actions";
import { getProductsGroupedByChannel } from "../../app/actions/store-actions/products/get-products";
import ProductGridClient from "../../components/dashboard/products/product-grid-client";
import CreateProductForm from "../../components/dashboard/products/form-create-product";
import { SECTIONS } from "../../lib/constans";
import ProfileData from "../../components/dashboard/profile/profile-data";
import SalesChannel from "./stores/store";
import { getMyStores } from "../../app/actions/store-actions/get-my-store";

export default function DashboardClientPage({ user }) {
  const [activeSection, setActiveSection] = useState("profile");
  const [productsByStore, setProductsByStore] = useState({});
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const regions = await getRegions();

        const myStores = await getMyStores();
        setStores(myStores);

        if (regions.length > 0 && myStores?.length > 0) {
          const grouped = await getProductsGroupedByChannel(
            regions[0].id,
            myStores,
          );
          setProductsByStore(grouped);
        } else {
          setProductsByStore({});
        }
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-gray-900">
            Cargando datos de Medusa...
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Esto puede demorar unos segundos.
          </p>
          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-blue-600" />
          </div>
        </div>
      );
    }
    switch (activeSection) {
      case "profile":
        return <ProfileData user={user} />;
      case "stores":
        return <SalesChannel />;
      case "create-product":
        return <CreateProductForm />;
      case "products":
        return (
          <div className="w-full">
            <ProductGridClient
              productsByStore={productsByStore}
              onEdit={() => {}}
              onDelete={() => {}}
              onUpdate={() => {}}
            />
          </div>
        );
    }
  };

  const activeSectionData = SECTIONS.find((sec) => sec.id === activeSection);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="lg:pl-72">
        <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="lg:hidden inline-flex size-10 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Abrir menú"
                  type="button"
                >
                  <Menu className="size-5 text-gray-800" />
                </button>

                <div>
                  <h1 className="text-base font-semibold text-gray-900">
                    {activeSectionData?.title}
                  </h1>
                  <p className="text-xs text-gray-500">
                    Gestiona tu cuenta y tiendas
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <span className="rounded-full bg-gray-100 px-3 py-1">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
