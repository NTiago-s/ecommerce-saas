"use client";

import { SECTIONS } from "../../lib/constans";

export default function Sidebar({ activeSection, setActiveSection }) {
  return (
    <aside className="w-64 bg-white shadow-md p-6 fixed h-full">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Panel</h2>

      <nav className="flex flex-col gap-2">
        {SECTIONS.map((sec) => (
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
            {sec.title}
          </button>
        ))}
      </nav>
    </aside>
  );
}
