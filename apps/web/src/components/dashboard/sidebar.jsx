"use client";

export default function Sidebar({ activeSection, setActiveSection }) {
  const sections = [
    { id: "dashboard", label: "Dashboard" },
    { id: "create-product", label: "Crear Producto" },
    { id: "edit-products", label: "Editar Productos" },
    { id: "discounts", label: "Añadir Descuentos" },
    { id: "inventory", label: "Gestionar Inventario" },
    { id: "promotions", label: "Promociones" },
    { id: "price-list", label: "Lista de Precios" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md p-6 fixed h-full">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Panel</h2>

      <nav className="flex flex-col gap-2">
        {sections.map((sec) => (
          <button
            key={sec.id}
            className={`text-left px-4 py-2 rounded-md transition cursor-pointer
              ${
                activeSection === sec.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100 text-gray-700"
              }`}
            onClick={() => setActiveSection(sec.id)}
          >
            {sec.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
