"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Tag,
  Package,
  DollarSign,
  Percent,
  Save,
  X,
  Plus,
  Minus,
} from "lucide-react";
import EditProductForm from "./form-edit-product";
import {
  deleteMedusaProduct,
  toggleProductStatus,
} from "../../../app/actions/store-actions/products/delete-product";

export default function ProductDetailClient({ product, store, stores }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] = useState("percentage"); // percentage or fixed

  const variant = product.variants?.[0];
  const rawPrice =
    variant?.calculated_price?.calculated_amount ||
    variant?.prices?.[0]?.amount ||
    0;

  const priceNumber =
    typeof rawPrice === "number" ? rawPrice : Number(rawPrice) || 0;
  const priceInUnits = priceNumber / 100;

  const formattedPrice = priceInUnits.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const handleToggleStatus = async () => {
    try {
      const result = await toggleProductStatus(product.id, store.id);
      if (result.success) {
        router.refresh();
      } else {
        console.error("Error toggling product status:", result.error);
        alert("Error al cambiar el estado del producto");
      }
    } catch (error) {
      console.error("Error toggling product status:", error);
      alert("Error al cambiar el estado del producto");
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.",
      )
    ) {
      try {
        const result = await deleteMedusaProduct(product.id, store.id);
        if (result.success) {
          router.push("/dashboard");
        } else {
          throw new Error(result.error || "No se pudo eliminar el producto");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error al eliminar el producto");
      }
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountValue) {
      alert("Por favor ingresa un valor de descuento");
      return;
    }

    try {
      // Aquí implementarías la lógica para aplicar el descuento
      // Por ahora solo mostramos un mensaje
      alert(
        `Descuento aplicado: ${discountValue}${discountType === "percentage" ? "%" : " USD"}`,
      );
      setShowDiscountForm(false);
      setDiscountValue("");
      router.refresh();
    } catch (error) {
      console.error("Error applying discount:", error);
      alert("Error al aplicar el descuento");
    }
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="size-5" />
              Volver al detalle
            </button>
          </div>

          <EditProductForm
            product={product}
            onSuccess={() => {
              setIsEditing(false);
              router.refresh();
            }}
            storeId={store.id}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <nav aria-label="Navegación">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
              aria-label="Volver al dashboard principal"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
              Volver al dashboard
            </button>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span
                  className="text-gray-600"
                  aria-label={`SKU del producto: ${product.handle || "No disponible"}`}
                >
                  SKU: {product.handle || "N/A"}
                </span>
                <span
                  className={`text-white text-xs px-3 py-1 rounded-full ${
                    product.status === "published"
                      ? "bg-green-600"
                      : "bg-gray-600"
                  }`}
                  role="status"
                  aria-label={`Estado del producto: ${
                    product.status === "published" ? "Activo" : "Inactivo"
                  }`}
                >
                  {product.status === "published" ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Editar producto"
              >
                <Edit className="size-4" aria-hidden="true" />
                Editar
              </button>

              <button
                onClick={handleToggleStatus}
                className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                aria-label={`
                  ${product.status === "published" ? "Desactivar" : "Activar"} producto
                `}
              >
                {product.status === "published" ? (
                  <>
                    <Lock className="size-4" aria-hidden="true" />
                    Desactivar
                  </>
                ) : (
                  <>
                    <Unlock className="size-4" aria-hidden="true" />
                    Activar
                  </>
                )}
              </button>

              <button
                onClick={() => setShowDiscountForm(!showDiscountForm)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                aria-label="Aplicar descuento al producto"
              >
                <Percent className="size-4" aria-hidden="true" />
                Descuento
              </button>

              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Eliminar producto permanentemente"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Eliminar
              </button>
            </div>
          </div>
        </header>

        {/* Discount Form */}
        {showDiscountForm && (
          <section
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
            aria-labelledby="discount-form-title"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 id="discount-form-title" className="text-xl font-semibold">
                Aplicar Descuento
              </h2>
              <button
                onClick={() => setShowDiscountForm(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md p-1"
                aria-label="Cerrar formulario de descuento"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="discount-type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tipo de descuento
                </label>
                <select
                  id="discount-type"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  aria-describedby="discount-type-help"
                >
                  <option value="percentage">Porcentaje (%)</option>
                  <option value="fixed">Monto fijo ($)</option>
                </select>
                <span id="discount-type-help" className="sr-only">
                  Selecciona entre descuento porcentual o monto fijo
                </span>
              </div>

              <div>
                <label
                  htmlFor="discount-value"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Valor del descuento
                </label>
                <input
                  id="discount-value"
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={
                    discountType === "percentage" ? "Ej: 10" : "Ej: 5.00"
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  aria-describedby="discount-value-help"
                  aria-label={`Valor del descuento en ${
                    discountType === "percentage" ? "porcentaje" : "dólares"
                  }`}
                />
                <span id="discount-value-help" className="sr-only">
                  Ingresa el valor numérico del descuento
                </span>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleApplyDiscount}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  aria-label="Aplicar descuento al producto"
                >
                  <Save className="size-4" aria-hidden="true" />
                  Aplicar Descuento
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Product Details Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Image */}
          <section className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">
                Imagen del Producto
              </h2>
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={product.thumbnail || "/placeholder.jpg"}
                  alt={product.title}
                  className="object-cover w-full h-full"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </section>

          {/* Product Information */}
          <section
            className="lg:col-span-2 space-y-6"
            aria-label="Información del producto"
          >
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Información Básica</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Package className="inline size-4 mr-1" />
                    Nombre del Producto
                  </label>
                  <p className="text-gray-900">{product.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Tag className="inline size-4 mr-1" />
                    SKU/Handle
                  </label>
                  <p className="text-gray-900">{product.handle || "N/A"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <DollarSign className="inline size-4 mr-1" />
                    Precio
                  </label>
                  <p className="text-2xl font-bold text-blue-600">
                    {formattedPrice}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <span
                    className={`inline-flex text-white text-xs px-3 py-1 rounded-full ${
                      product.status === "published"
                        ? "bg-green-600"
                        : "bg-gray-600"
                    }`}
                  >
                    {product.status === "published" ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <p
                  className="text-gray-900 whitespace-pre-wrap"
                  aria-label={`Descripción del producto: ${product.title}`}
                >
                  {product.description || "Sin descripción disponible."}
                </p>
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <section
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                aria-labelledby="variants-title"
              >
                <h2 id="variants-title" className="text-lg font-semibold mb-4">
                  Variantes
                </h2>
                <div className="space-y-4" role="list">
                  {product.variants.map((variant, index) => (
                    <div
                      key={variant.id}
                      className="border border-gray-200 rounded-lg p-4"
                      role="listitem"
                      aria-label={`Variante ${index + 1}: ${variant.title || "Sin nombre"}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {variant.title || `Variante ${index + 1}`}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            SKU: {variant.sku || "N/A"}
                          </p>
                          {variant.inventory_quantity !== undefined && (
                            <p
                              className="text-sm text-gray-600 mt-1"
                              aria-label={`Stock disponible: ${variant.inventory_quantity} unidades`}
                            >
                              Stock: {variant.inventory_quantity} unidades
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p
                            className="text-lg font-semibold text-blue-600"
                            aria-label={`Precio de la variante: ${
                              variant.calculated_price?.calculated_amount
                                ? `$${(variant.calculated_price.calculated_amount / 100).toFixed(2)}`
                                : variant.prices?.[0]?.amount
                                  ? `$${(variant.prices[0].amount / 100).toFixed(2)}`
                                  : "No disponible"
                            }`}
                          >
                            {variant.calculated_price?.calculated_amount
                              ? `$${(variant.calculated_price.calculated_amount / 100).toFixed(2)}`
                              : variant.prices?.[0]?.amount
                                ? `$${(variant.prices[0].amount / 100).toFixed(2)}`
                                : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Store Information */}
            <section
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              aria-labelledby="store-info-title"
            >
              <h2 id="store-info-title" className="text-lg font-semibold mb-4">
                Información de la Tienda
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tienda
                  </label>
                  <p
                    className="text-gray-900"
                    aria-label={`Nombre de la tienda: ${store.name}`}
                  >
                    {store.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID de Tienda
                  </label>
                  <p
                    className="text-gray-900"
                    aria-label={`ID de la tienda: ${store.id}`}
                  >
                    {store.id}
                  </p>
                </div>
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}
