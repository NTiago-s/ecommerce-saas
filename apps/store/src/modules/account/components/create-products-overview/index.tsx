"use client"
import { createMedusaProduct } from "actions/store-actions/create-products"
import { useState, FormEvent, useRef } from "react"
import { X, Plus, ChevronDown } from "@medusajs/icons"

export default function CreateProductForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  // Estados para interactividad específica
  const [hasVariants, setHasVariants] = useState(false)
  const [isDiscountable, setIsDiscountable] = useState(true)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    const result = await createMedusaProduct(data)

    setLoading(false)
    if (result.success) {
      setMessage("✅ Producto publicado con éxito")
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      setMessage("❌ Error: " + result.error)
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] text-gray-200 font-sans p-6 pb-24">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-[#18181b] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
      >
        {/* HEADER ESTATICO */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#18181b]/80 backdrop-blur-md">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Create New Product
          </h2>
          <button
            type="button"
            className="text-gray-500 hover:text-white transition p-2"
          >
            <X />
          </button>
        </div>

        <div className="p-8 space-y-16">
          {/* SECCIÓN 1: GENERAL & DETAILS */}
          <section className="space-y-8">
            <header>
              <h3 className="text-lg font-semibold">General Details</h3>
              <p className="text-sm text-gray-500">
                Configure the basic information of your product.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputGroup
                label="Title"
                name="title"
                placeholder="Winter jacket"
                required
              />
              <InputGroup
                label="Subtitle"
                name="subtitle"
                placeholder="Warm and cosy"
              />
              <InputGroup
                label="Handle"
                name="handle"
                placeholder="winter-jacket"
                prefix="/"
              />
            </div>

            <div>
              <label className="text-[11px] text-gray-500 uppercase font-bold mb-2 block">
                Description (Optional)
              </label>
              <textarea
                name="description"
                rows={4}
                className="w-full bg-[#111111] border border-white/10 rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition"
                placeholder="A warm and cozy jacket..."
              />
            </div>
          </section>

          <hr className="border-white/5" />

          {/* SECCIÓN 2: MEDIA */}
          <section className="space-y-6">
            <header>
              <h3 className="text-lg font-semibold">Media</h3>
              <p className="text-sm text-gray-500">
                Add up to 10 images to your product.
              </p>
            </header>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center hover:border-white/20 transition cursor-pointer bg-[#111111]">
              <p className="text-sm text-gray-400">
                Drag and drop images here or click to upload.
              </p>
            </div>
          </section>

          <hr className="border-white/5" />

          {/* SECCIÓN 3: ORGANIZE */}
          <section className="space-y-8">
            <header>
              <h3 className="text-lg font-semibold">Organize</h3>
              <p className="text-sm text-gray-500">
                Control how your product is categorized and found.
              </p>
            </header>

            <div className="bg-[#242427] p-4 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Discountable</p>
                <p className="text-xs text-gray-500">
                  Allow discounts to be applied to this product.
                </p>
              </div>
              <Toggle
                active={isDiscountable}
                onClick={() => setIsDiscountable(!isDiscountable)}
                name="discountable"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectGroup
                label="Type"
                name="type"
                options={["T-Shirt", "Sweatshirt", "Pants"]}
              />
              <SelectGroup
                label="Collection"
                name="collection"
                options={["Summer", "Winter", "Spring"]}
              />
              <SelectGroup
                label="Categories"
                name="categories"
                options={["Shirts", "Pants", "Merch"]}
                isMulti
              />
              <InputGroup label="Tags" name="tags" placeholder="tag1, tag2" />
            </div>
          </section>

          <hr className="border-white/5" />

          {/* SECCIÓN 4: VARIANTS */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <header>
                <h3 className="text-lg font-semibold">Variants</h3>
                <p className="text-sm text-gray-500">
                  Manage pricing and inventory for different versions.
                </p>
              </header>
              {!hasVariants && (
                <button
                  type="button"
                  onClick={() => setHasVariants(true)}
                  className="text-xs font-bold uppercase text-blue-500 hover:text-blue-400 flex items-center gap-1"
                >
                  <Plus /> Enable Variants
                </button>
              )}
            </div>

            {hasVariants ? (
              <div className="overflow-x-auto border border-white/10 rounded-lg bg-[#111111]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#18181b] text-gray-400 uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Price USD</th>
                      <th className="px-4 py-3">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="px-4 py-3">
                        <input
                          name="v_title"
                          defaultValue="Default"
                          className="bg-transparent border-none outline-none text-blue-400 w-full"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          name="v_sku"
                          placeholder="SKU-..."
                          className="bg-transparent border-none outline-none w-full"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          name="price"
                          type="number"
                          step="0.01"
                          className="bg-transparent border-none outline-none w-20"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          name="inventory"
                          type="number"
                          className="bg-transparent border-none outline-none w-16"
                          placeholder="0"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-[#242427] p-6 rounded-xl border border-white/5 text-center">
                <p className="text-sm text-gray-400">
                  This product has no variants. A default variant will be
                  created.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <InputGroup
                    label="Price (USD)"
                    name="price"
                    type="number"
                    step="0.01"
                  />
                  <InputGroup label="Stock" name="inventory" type="number" />
                </div>
              </div>
            )}
            <input
              type="hidden"
              name="has_variants"
              value={hasVariants ? "true" : "false"}
            />
          </section>
        </div>

        {/* FOOTER ACCIONES (STICKY) */}
        <div className="sticky bottom-0 border-t border-white/10 p-4 bg-[#111111] flex items-center justify-end gap-3 rounded-b-xl">
          {message && (
            <span
              className={`mr-auto text-sm ${
                message.includes("✅") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </span>
          )}

          <button
            type="button"
            className="px-4 py-2 text-sm font-medium hover:bg-white/5 rounded-md transition text-gray-400"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 text-sm font-medium bg-white text-black hover:bg-gray-200 rounded-md disabled:opacity-50 transition shadow-lg"
          >
            {loading ? "Publishing..." : "Publish Product"}
          </button>
        </div>
      </form>
    </div>
  )
}

// COMPONENTES DE APOYO

function InputGroup({ label, prefix, icon, ...props }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] text-gray-500 uppercase font-bold flex items-center gap-1">
        {label} {icon}
      </label>
      <div className="flex bg-[#111111] border border-white/10 rounded-lg focus-within:border-blue-500 transition overflow-hidden">
        {prefix && (
          <span className="pl-3 py-2 text-gray-600 text-sm select-none">
            {prefix}
          </span>
        )}
        <input
          {...props}
          className="w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-gray-700"
        />
      </div>
    </div>
  )
}

function SelectGroup({ label, options, isMulti }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] text-gray-500 uppercase font-bold">
        {label}
      </label>
      <div className="relative">
        <select className="w-full bg-[#111111] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none appearance-none focus:border-blue-500 transition">
          <option value="">
            {isMulti ? "Select categories..." : "Select..."}
          </option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-2.5 pointer-events-none text-gray-500">
          <ChevronDown />
        </div>
      </div>
    </div>
  )
}

function Toggle({ active, onClick, name }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-10 h-5 rounded-full relative transition-colors ${
        active ? "bg-blue-600" : "bg-gray-700"
      }`}
    >
      <input type="hidden" name={name} value={active ? "true" : "false"} />
      <div
        className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${
          active ? "right-1" : "right-6"
        }`}
      />
    </button>
  )
}
