"use client";
import { createMedusaProduct } from "../../../app/actions/store-actions/products/create-products";
import { useState, useRef } from "react";

export default function CreateProductForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  // Estados para el formulario
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    handle: "",
    description: "",
    material: "",
    type: "",
    collection: "",
    categories: [],
    tags: "",
    discountable: true,
    status: "published",
  });

  // Estados para variantes
  const [hasVariants, setHasVariants] = useState(false);
  const [productOptions, setProductOptions] = useState([
    { title: "", values: "" },
  ]);
  const [variants, setVariants] = useState([
    {
      title: "Default Variant",
      sku: "",
      ean: "",
      upc: "",
      barcode: "",
      manage_inventory: true,
      allow_backorder: false,
      inventory_kit: false,
      prices: {
        usd: "",
        eur: "",
        ars: "",
      },
    },
  ]);

  // Estados para imágenes
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      newVariants[index][parent][child] = value;
    } else {
      newVariants[index][field] = value;
    }
    setVariants(newVariants);
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...productOptions];
    newOptions[index][field] = value;
    setProductOptions(newOptions);
  };

  const addOption = () => {
    setProductOptions([...productOptions, { title: "", values: "" }]);
  };

  const removeOption = (index) => {
    setProductOptions(productOptions.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        title: `Variant ${variants.length + 1}`,
        sku: "",
        ean: "",
        upc: "",
        barcode: "",
        manage_inventory: true,
        allow_backorder: false,
        inventory_kit: false,
        prices: {
          usd: "",
          eur: "",
          ars: "",
        },
      },
    ]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Validar archivos
    const validFiles = selectedFiles.filter((file) => {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        console.warn(`Skipping non-image file: ${file.name}`);
        return false;
      }

      // Validar tamaño (10MB máximo)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        console.warn(
          `Skipping oversized file: ${file.name} (${file.size} bytes)`,
        );
        return false;
      }

      return true;
    });

    if (validFiles.length !== selectedFiles.length) {
      const invalidCount = selectedFiles.length - validFiles.length;
      setMessage(
        `⚠️ Se omitieron ${invalidCount} archivo(s) inválidos. Solo se permiten imágenes de hasta 10MB.`,
      );
      setTimeout(() => setMessage(""), 5000);
    }

    setImages((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Preparar opciones del producto
      const options = hasVariants
        ? productOptions
            .filter((opt) => opt.title && opt.values)
            .map((opt) => ({
              title: opt.title,
              values: opt.values
                .split(",")
                .map((v) => v.trim())
                .filter((v) => v),
            }))
        : [{ title: "Default", values: ["Default"] }];

      // Preparar variantes
      const preparedVariants =
        hasVariants && options.length > 0
          ? generateVariantsFromOptions(options, variants[0])
          : [
              {
                title: formData.title || "Default Variant",
                sku: variants[0]?.sku || `sku-${Date.now()}`,
                manage_inventory: variants[0]?.manage_inventory ?? true,
                allow_backorder: variants[0]?.allow_backorder ?? false,
                prices: Object.entries(variants[0]?.prices || {})
                  .filter(([_, price]) => price)
                  .map(([currency, price]) => ({
                    amount: Math.round(parseFloat(price) * 100),
                    currency_code: currency.toUpperCase(),
                  })),
              },
            ];

      const productData = {
        ...formData,
        options,
        variants: preparedVariants,
        images: images, // Enviar los objetos File directamente
      };

      const result = await createMedusaProduct(productData);

      if (result.success) {
        setMessage("✅ Producto creado exitosamente");
        if (onSuccess) {
          onSuccess(result.data);
        }
        // Reset form
        setFormData({
          title: "",
          subtitle: "",
          handle: "",
          description: "",
          material: "",
          type: "",
          collection: "",
          categories: [],
          tags: "",
          discountable: true,
          status: "published",
        });
        setImages([]);
        setVariants([
          {
            title: "Default Variant",
            sku: "",
            ean: "",
            upc: "",
            barcode: "",
            manage_inventory: true,
            allow_backorder: false,
            inventory_kit: false,
            prices: { usd: "", eur: "", ars: "" },
          },
        ]);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Función para generar variantes basadas en opciones
  const generateVariantsFromOptions = (options, baseVariant) => {
    // Esta es una versión simplificada - en producción necesitarías generar
    // todas las combinaciones posibles de opciones
    return [
      {
        title: `${options.map((opt) => opt.values[0]).join(" / ")}`,
        sku: baseVariant?.sku || `sku-${Date.now()}`,
        manage_inventory: baseVariant?.manage_inventory ?? true,
        allow_backorder: baseVariant?.allow_backorder ?? false,
        prices: Object.entries(baseVariant?.prices || {})
          .filter(([_, price]) => price)
          .map(([currency, price]) => ({
            amount: Math.round(parseFloat(price) * 100),
            currency_code: currency.toUpperCase(),
          })),
        options: options.map((opt) => ({
          value: opt.values[0],
          option_id: opt.title.toLowerCase().replace(/\s+/g, "_"),
        })),
      },
    ];
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Crear Nuevo Producto
        </h1>
        <p className="text-gray-600 mt-1">
          Agrega un nuevo producto a tu catálogo
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: "details", label: "Detalles" },
          { id: "organization", label: "Organización" },
          { id: "variants", label: "Variantes" },
          { id: "media", label: "Multimedia" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Tab: Detalles */}
        {activeTab === "details" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Producto *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Camiseta de Algodón"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) =>
                    handleInputChange("subtitle", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Comodidad y estilo"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Handle (URL)
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-lg">
                  /
                </span>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) => handleInputChange("handle", e.target.value)}
                  className="flex-1 border border-gray-300 rounded-r-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="camiseta-algodon"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe tu producto en detalle..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material
              </label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => handleInputChange("material", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Algodón 100%"
              />
            </div>
          </div>
        )}

        {/* Tab: Organización */}
        {activeTab === "organization" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar tipo...</option>
                  <option value="clothing">Ropa</option>
                  <option value="accessories">Accesorios</option>
                  <option value="electronics">Electrónica</option>
                  <option value="home">Hogar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Colección
                </label>
                <select
                  value={formData.collection}
                  onChange={(e) =>
                    handleInputChange("collection", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar colección...</option>
                  <option value="summer">Verano</option>
                  <option value="winter">Invierno</option>
                  <option value="new-arrival">Nuevos Llegados</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiquetas
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: moda, casual, urbano"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">
                  Aplicar descuentos
                </h4>
                <p className="text-sm text-gray-600">
                  Permitir que este producto tenga descuentos aplicados
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleInputChange("discountable", !formData.discountable)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.discountable ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.discountable ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Tab: Variantes */}
        {activeTab === "variants" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">
                  ¿Este producto tiene variantes?
                </h4>
                <p className="text-sm text-gray-600">
                  Ej: diferentes colores, tallas, etc.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHasVariants(!hasVariants)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  hasVariants ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    hasVariants ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {hasVariants && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">
                    Opciones del Producto
                  </h4>
                  <button
                    type="button"
                    onClick={addOption}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    + Agregar Opción
                  </button>
                </div>

                {productOptions.map((option, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Título de la Opción
                        </label>
                        <input
                          type="text"
                          value={option.title}
                          onChange={(e) =>
                            handleOptionChange(index, "title", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ej: Color"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Valores (separados por coma)
                        </label>
                        <input
                          type="text"
                          value={option.values}
                          onChange={(e) =>
                            handleOptionChange(index, "values", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ej: Rojo, Azul, Verde"
                        />
                      </div>
                    </div>
                    {productOptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="mt-2 text-red-600 hover:text-red-800 text-sm"
                      >
                        Eliminar opción
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  {hasVariants
                    ? "Variantes del Producto"
                    : "Información del Producto"}
                </h4>
                {hasVariants && (
                  <button
                    type="button"
                    onClick={addVariant}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    + Agregar Variante
                  </button>
                )}
              </div>

              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título
                      </label>
                      <input
                        type="text"
                        value={variant.title}
                        onChange={(e) =>
                          handleVariantChange(index, "title", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) =>
                          handleVariantChange(index, "sku", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        EAN
                      </label>
                      <input
                        type="text"
                        value={variant.ean}
                        onChange={(e) =>
                          handleVariantChange(index, "ean", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        UPC
                      </label>
                      <input
                        type="text"
                        value={variant.upc}
                        onChange={(e) =>
                          handleVariantChange(index, "upc", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio USD *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={variant.prices.usd}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "prices.usd",
                              e.target.value,
                            )
                          }
                          className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio EUR
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">
                          €
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={variant.prices.eur}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "prices.eur",
                              e.target.value,
                            )
                          }
                          className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio ARS
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={variant.prices.ars}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "prices.ars",
                              e.target.value,
                            )
                          }
                          className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={variant.manage_inventory}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "manage_inventory",
                            e.target.checked,
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Gestionar inventario
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={variant.allow_backorder}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "allow_backorder",
                            e.target.checked,
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Permitir pedidos pendientes
                      </span>
                    </label>
                  </div>

                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="mt-4 text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar variante
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Multimedia */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imágenes del Producto
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 cursor-pointer transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-gray-600 mb-2">
                    Haz clic para subir imágenes
                  </p>
                  <p className="text-sm text-gray-500">
                    o arrastra y suelta archivos aquí
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    PNG, JPG, GIF hasta 10MB
                  </p>
                </div>
              </div>

              {images.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Imágenes seleccionadas ({images.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.url || URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mensaje de feedback */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.includes("✅")
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !formData.title}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creando..." : "Crear Producto"}
          </button>
        </div>
      </form>
    </div>
  );
}
