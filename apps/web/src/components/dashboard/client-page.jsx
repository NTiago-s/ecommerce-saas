"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/dashboard/sidebar";
import { getRegions } from "../../app/actions/store-actions/get-actions";
import { getProductsFromMedusa } from "../../app/actions/store-actions/products/get-products";
import ProductGridClient from "../../components/dashboard/products/product-grid-client";
import CreateProductForm from "../../components/dashboard/products/form-create-product";
import { SECTIONS } from "../../lib/constans";
import ProfileData from "../../components/dashboard/profile/profile-data";
import SalesChannel from "./stores/store";
import { getMyActiveStore } from "../../app/actions/store-actions/get-my-store";

export default function DashboardClientPage({ user }) {
  const [activeSection, setActiveSection] = useState("profile");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // 1. Necesitamos una acción que nos dé la tienda activa del usuario
        // Asumiremos que traes la primera tienda por ahora
        const regions = await getRegions();

        // DEBES CREAR ESTA ACCIÓN: getMyActiveStore()
        const myStore = await getMyActiveStore();

        if (regions.length > 0 && myStore?.medusaSalesChannelId) {
          const data = await getProductsFromMedusa(
            regions[0].id,
            myStore.medusaSalesChannelId,
          );

          setProducts(data);
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
    if (loading)
      return <p className="text-center mt-10">Cargando datos de Medusa...</p>;
    switch (activeSection) {
      case "profile":
        return <ProfileData user={user} />;
      case "stores":
        return <SalesChannel />;
      case "create-product":
        return <CreateProductForm />;
      case "edit-products":
        return <ProductGridClient products={products} />;
    }
  };

  const activeSectionData = SECTIONS.find((sec) => sec.id === activeSection);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="flex-1 ml-64 p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 capitalize">
            {activeSectionData?.title}
          </h1>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}
