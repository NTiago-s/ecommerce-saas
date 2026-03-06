"use client";

import { X, User, Store, Package, PlusCircle } from "lucide-react";
import { SECTIONS } from "../../lib/constans";

const SECTION_ICONS = {
  profile: User,
  stores: Store,
  products: Package,
  "create-product": PlusCircle,
};

export default function Sidebar({
  activeSection,
  setActiveSection,
  open,
  setOpen,
}) {
  const handleSelect = (sectionId) => {
    setActiveSection(sectionId);
    if (typeof setOpen === "function") setOpen(false);
  };

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
          role="presentation"
        />
      ) : null}

      <aside
        className={
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-gray-200 bg-white shadow-sm transition-transform lg:translate-x-0" +
          (open ? " translate-x-0" : " -translate-x-full")
        }
        aria-label="Menú de navegación del dashboard"
        role="navigation"
      >
        <header className="flex items-center justify-between px-6 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
          <button
            className="lg:hidden inline-flex size-10 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú de navegación"
            type="button"
          >
            <X className="size-5 text-gray-700" aria-hidden="true" />
          </button>
        </header>

        <nav className="px-4 pb-6 pt-6" aria-label="Secciones del dashboard">
          <div className="flex flex-col gap-1" role="list">
            {SECTIONS.map((sec) => {
              const Icon = SECTION_ICONS[sec.id];
              const isActive = activeSection === sec.id;

              return (
                <button
                  key={sec.id}
                  className={
                    "group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition cursor-pointer" +
                    (isActive
                      ? " bg-blue-600 text-white"
                      : " text-gray-700 hover:bg-gray-100")
                  }
                  onClick={() => handleSelect(sec.id)}
                  type="button"
                  role="listitem"
                  aria-label={`Ir a ${sec.title.toLowerCase()}`}
                  aria-current={isActive ? "page" : "false"}
                >
                  <span className="flex items-center gap-3">
                    {Icon ? (
                      <Icon
                        className={
                          "size-4" +
                          (isActive ? " text-white" : " text-gray-500")
                        }
                        aria-hidden="true"
                      />
                    ) : null}
                    {sec.title}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
