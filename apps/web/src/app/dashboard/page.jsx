"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/dashboard/sidebar";
import {
  getProductsFromMedusa,
  getRegions,
} from "../actions/store-actions/get-actions";
import ProductGridClient from "../../components/dashboard/product-grid-client";
import CreateProductForm from "../../components/dashboard/form-create-product";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos al iniciar
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const regions = await getRegions();
      if (regions.length > 0) {
        // Usamos la primera región para obtener los precios
        const data = await getProductsFromMedusa(regions[0].id);
        setProducts(data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Función para renderizar el contenido dinámico
  const renderContent = () => {
    if (loading)
      return <p className="text-center mt-10">Cargando datos de Medusa...</p>;

    switch (activeSection) {
      case "dashboard":
        return <ProductGridClient products={products} />;
      case "create-product":
        return <CreateProductForm />;
      case "edit-products":
        return (
          <div className="p-10 bg-white rounded-lg shadow">
            Lista para editar
          </div>
        );
      // Añade aquí el resto de secciones...
      default:
        return <ProductGridClient products={products} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="flex-1 ml-64 p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 capitalize">
            {activeSection.replace("-", " ")}
          </h1>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}
