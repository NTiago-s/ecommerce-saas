"use client";

import { X, User, Store, Package, PlusCircle, CreditCard } from "lucide-react";
import { SECTIONS } from "../../lib/constans";

const SECTION_ICONS = {
  profile: User,
  stores: Store,
  billing: CreditCard,
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
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
          role="presentation"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-[var(--border)] bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-transform backdrop-blur-xl lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Menú de navegación del dashboard"
        role="navigation"
      >
        <header className="flex items-center justify-between px-6 pt-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Dashboard
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
              Codeluxe
            </h2>
          </div>
          <button
            className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--border)] bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú de navegación"
            type="button"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <nav className="px-4 pb-6 pt-6" aria-label="Secciones del dashboard">
          <div className="flex flex-col gap-1.5" role="list">
            {SECTIONS.map((sec) => {
              const Icon = SECTION_ICONS[sec.id];
              const isActive = activeSection === sec.id;

              return (
                <button
                  key={sec.id}
                  className={`group flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium transition ${
                    isActive
                      ? "border border-blue-200 bg-blue-50 text-slate-950"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                  onClick={() => handleSelect(sec.id)}
                  type="button"
                  role="listitem"
                  aria-label={`Ir a ${sec.title.toLowerCase()}`}
                  aria-current={isActive ? "page" : "false"}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`inline-flex size-9 items-center justify-center rounded-2xl border ${
                        isActive
                          ? "border-blue-200 bg-white text-[var(--accent)]"
                          : "border-[var(--border)] bg-white text-slate-500"
                      }`}
                    >
                      {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
                    </span>
                    <span>{sec.title}</span>
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

