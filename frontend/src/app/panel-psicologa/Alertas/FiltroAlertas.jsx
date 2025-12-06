"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function FiltroAlertas({ seleccion, setSeleccion }) {
  const [open, setOpen] = useState(false);

  const opciones = ["Todas las alertas", "Críticas", "Alta prioridad"];

  // Aseguramos que tenga un valor por defecto
  useEffect(() => {
    if (!seleccion) setSeleccion("Todas las alertas");
  }, [seleccion, setSeleccion]);

  return (
    <div className="relative text-sm">
      {/* Botón */}
      <button
        onClick={() => setOpen(!open)}
        className="w-40 bg-white border border-gray-300 rounded-xl px-4 py-2 flex justify-between items-center shadow-sm hover:bg-gray-50"
      >
        {seleccion || "Todas las alertas"}
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-30">
          {opciones.map((op) => (
            <button
              key={op}
              onClick={() => {
                setSeleccion(op);
                setOpen(false);
              }}
              className={`w-full px-4 py-2 text-left flex justify-between items-center rounded-lg hover:bg-purple-100/50 transition
                ${
                  seleccion === op
                    ? "bg-purple-200/50 text-purple-700 font-medium"
                    : "text-gray-700"
                }
              `}
            >
              {op}
              {seleccion === op && (
                <Check className="h-4 w-4 text-purple-700" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
