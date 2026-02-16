"use client";
import { createMedusaProduct } from "../../../app/actions/store-actions/products/create-products";
import { useState, useRef } from "react";

export default function CreateProductForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("Detalles");

  // --- ESTADOS DE LA SECCIÓN DETAILS ---
  const [hasVariants, setHasVariants] = useState(false);
  const [images, setImages] = useState([]); // Para previsualización o lista de archivos
  const fileInputRef = useRef(null);

  // Estado para las opciones (Color, Talla, etc.) que se activan con el toggle
  const [productOptions, setProductOptions] = useState([
    { title: "", values: "" },
  ]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selectedFiles]);
  };

  const addOption = () => {
    setProductOptions([...productOptions, { title: "", values: "" }]);
  };

  const removeOption = (index) => {
    setProductOptions(productOptions.filter((_, i) => i !== index));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    // Nota: El formData capturará automáticamente los archivos del input name="images"
    const result = await createMedusaProduct(formData);
    setLoading(false);
    if (result.success) setMessage("✅ Producto creado");
  }

  return (
    <div className="max-w-6xl mx-auto bg-[#111111] text-gray-200 min-h-screen p-6 rounded-xl border border-gray-800 my-10 font-sans">
      {/* TABS SUPERIORES */}
      <div className="flex items-center border-b border-gray-800 mb-8">
        {["Detalles", "Organizacion", "Variantes"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-6 pb-4 text-sm font-medium transition-colors relative ${
              activeTab === tab ? "text-blue-500" : "text-gray-500"
            }`}
          >
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />
            )}
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* --- SECCIÓN: DETAILS --- */}
        {activeTab === "Detalles" && (
          <div className="space-y-10 animate-in fade-in">
            {/* 1. GENERAL */}
            <section>
              <h3 className="text-lg font-semibold mb-6">General</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] text-gray-400 uppercase mb-2">
                    Titulo
                  </label>
                  <input
                    name="title"
                    placeholder="Winter jacket"
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-2.5 outline-none focus:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 uppercase mb-2">
                    Subtitulo (Opcional)
                  </label>
                  <input
                    name="subtitle"
                    placeholder="Warm and cosy"
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-2.5 outline-none focus:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 uppercase mb-2">
                    palabra clave (Opcional)
                  </label>
                  <div className="flex items-center bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 group focus-within:border-gray-600">
                    <span className="text-gray-500 mr-2 text-sm">/</span>
                    <input
                      name="handle"
                      placeholder="winter-jacket"
                      className="w-full bg-transparent py-2.5 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-[11px] text-gray-400 uppercase mb-2">
                  Descripcion (Opcional)
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="A warm and cozy jacket"
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-2.5 outline-none focus:border-gray-600 resize-none"
                />
              </div>
            </section>

            {/* 2. MEDIA (Input File) */}
            <section>
              <h3 className="text-sm font-semibold mb-4 text-gray-400">
                Archivos (Opcional)
              </h3>
              <div
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-gray-800 rounded-xl p-10 text-center hover:bg-[#161616] transition cursor-pointer group"
              >
                <input
                  type="file"
                  name="images"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <span className="text-gray-400 text-sm mb-1 font-medium">
                    ⬆ Subir Imagenes
                  </span>
                  <p className="text-xs text-gray-500">
                    Arrastra y suelta imagenes aqui o haz click para subir.
                  </p>
                  {images.length > 0 && (
                    <p className="mt-2 text-blue-400 text-xs font-semibold">
                      {images.length} archivos seleccionados
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* 3. VARIANTS TOGGLE */}
            <section className="space-y-6">
              <div className="bg-[#1a1a1a] p-5 rounded-xl border border-gray-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Yes, this is a product with variants
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium">
                    When unchecked, we will create a default variant for you
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setHasVariants(!hasVariants)}
                  className={`w-10 h-5 rounded-full transition-all relative ${hasVariants ? "bg-blue-600" : "bg-gray-700"}`}
                >
                  <div
                    className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${hasVariants ? "left-6" : "left-1"}`}
                  />
                </button>
              </div>

              {/* SECCIÓN DINÁMICA DE OPCIONES (Aparece al activar el toggle) */}
              {hasVariants && (
                <div className="space-y-6 pt-4 animate-in slide-in-from-top-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-semibold">Product options</h4>
                      <p className="text-[11px] text-gray-500 font-medium">
                        Define the options for the product, e.g. color, size,
                        etc.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addOption}
                      className="bg-[#242424] px-4 py-1.5 rounded-lg text-xs font-semibold border border-gray-700 hover:bg-[#2a2a2a]"
                    >
                      Add
                    </button>
                  </div>

                  {productOptions.map((opt, index) => (
                    <div
                      key={index}
                      className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 relative group"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-2 text-[11px] text-gray-500 font-bold uppercase">
                          Title
                        </div>
                        <input
                          value={opt.title}
                          onChange={(e) => {
                            const newOps = [...productOptions];
                            newOps[index].title = e.target.value;
                            setProductOptions(newOps);
                          }}
                          className="col-span-9 bg-transparent border-b border-gray-800 py-1 outline-none focus:border-blue-500 text-sm"
                          placeholder="Color"
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="col-span-1 text-gray-500 hover:text-red-500 text-right"
                        >
                          ✕
                        </button>
                        <div className="col-span-2 text-[11px] text-gray-500 font-bold uppercase">
                          Values
                        </div>
                        <input
                          value={opt.values}
                          onChange={(e) => {
                            const newOps = [...productOptions];
                            newOps[index].values = e.target.value;
                            setProductOptions(newOps);
                          }}
                          className="col-span-9 bg-transparent border-b border-gray-800 py-1 outline-none focus:border-blue-500 text-sm"
                          placeholder="Red, Blue, Green"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="pt-6 border-t border-gray-800">
                    <h4 className="text-sm font-semibold mb-1">
                      Product variants
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium mb-4">
                      This ranking will affect the variants' order in your
                      storefront.
                    </p>
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 flex items-center space-x-3">
                      <span className="text-gray-500">ℹ</span>
                      <p className="text-[11px] text-gray-400 font-medium">
                        Add options to create variants.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === "Organizacion" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h3 className="text-lg font-semibold mb-6">Organizacion</h3>
            <section className="bg-[#1a1a1a] p-5 rounded-xl border border-gray-800 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">
                  Discountable <span className="text-gray-500">(Optional)</span>
                </p>
                <p className="text-xs text-gray-500">
                  When unchecked, discounts will not be applied to this product
                </p>
              </div>
              <button
                type="button"
                className="w-10 h-5 bg-blue-600 rounded-full relative"
              >
                <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full" />
              </button>
            </section>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase mb-2">
                  Type (Optional)
                </label>
                <select
                  name="type"
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-2.5 outline-none appearance-none"
                >
                  <option value="">Select type...</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase mb-2">
                  Collection (Optional)
                </label>
                <select
                  name="collection"
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-2.5 outline-none appearance-none"
                >
                  <option value="">Select collection...</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase mb-2">
                  Categories (Optional)
                </label>
                <select
                  name="categories"
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-2.5 outline-none appearance-none"
                >
                  <option value="">Select categories...</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase mb-2">
                  Tags (Optional)
                </label>
                <input
                  name="tags"
                  type="text"
                  placeholder="Search tags..."
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-2.5 outline-none"
                />
              </div>
            </div>

            <div className="pt-4">
              <label className="block text-xs font-medium text-gray-400 uppercase mb-2">
                Sales channels (Optional)
              </label>
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 flex items-center justify-between">
                <span className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-300 border border-gray-700">
                  Default Sales Channel
                </span>
                <button
                  type="button"
                  className="text-blue-500 text-xs font-semibold hover:text-blue-400"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- SECCIÓN 3: VARIANTS (Basado en imagen 4) --- */}
        {activeTab === "Variantes" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-semibold mb-4">Variantes</h3>
            <div className="overflow-x-auto rounded-xl border border-gray-800">
              <table className="w-full text-left text-sm border-separate border-spacing-0">
                <thead className="bg-[#1a1a1a] text-gray-400 text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="p-4 border-b border-gray-800">Title</th>
                    <th className="p-4 border-b border-gray-800">SKU</th>
                    <th className="p-4 border-b border-gray-800 text-center">
                      Inventory
                    </th>
                    <th className="p-4 border-b border-gray-800">Price ARS</th>
                    <th className="p-4 border-b border-gray-800">Price USD</th>
                    <th className="p-4 border-b border-gray-800">Price EUR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="p-4 text-blue-400">Default variant</td>
                    <td className="p-4">
                      <input
                        name="sku"
                        placeholder="SKU-XXX"
                        className="bg-transparent border-b border-gray-800 outline-none w-20 focus:border-blue-500"
                      />
                    </td>
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="accent-blue-600"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-600">$</span>
                        <input
                          name="price_ars"
                          placeholder="0.00"
                          className="bg-transparent outline-none w-16"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-600">$</span>
                        <input
                          name="price_usd"
                          placeholder="0.00"
                          className="bg-transparent outline-none w-16"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-600">€</span>
                        <input
                          name="price_eur"
                          placeholder="0.00"
                          className="bg-transparent outline-none w-16"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FOOTER ACCIONES */}
        <div className="flex justify-end items-center space-x-4 pt-8 border-t border-gray-800">
          <button
            type="button"
            className="text-sm font-medium text-gray-500 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-[#1a1a1a] px-4 py-2 rounded-lg text-sm font-medium border border-gray-800 hover:bg-[#222]"
          >
            Save as draft
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("Organize")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
