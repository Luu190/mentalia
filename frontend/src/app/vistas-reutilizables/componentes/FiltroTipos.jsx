"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Check,
  BookOpen,
  Play,
  Mic,
  CircleAlert,
  FileText,
  Filter,
} from "lucide-react";

export default function FiltroTipos({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tipos = [
    { label: "Todos los tipos", value: "todos", icon: Filter },
    { label: "Artículo", value: "Artículo", icon: FileText },
    { label: "Video", value: "Video", icon: Play },
    { label: "Podcast", value: "Podcast", icon: Mic },
    { label: "Técnica", value: "Técnica", icon: CircleAlert },
    { label: "Libro", value: "Libro", icon: BookOpen },
  ];

  const selectedTipo = tipos.find((t) => t.value === value) || tipos[0];

  return (
    <div className="relative" ref={ref}>
      
      {/* Botón principal */}
      <button
        onClick={() => setOpen(!open)}
        className="border border-gray-300 rounded-xl px-4 py-2 bg-white 
          flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition shadow-sm"
      >
        <selectedTipo.icon size={18} className="text-purple-500" />
        <span className="text-sm">{selectedTipo.label}</span>
        <ChevronDown size={18} className="text-gray-500" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg 
          rounded-xl border border-gray-200 py-2 z-20">
          
          {tipos.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                onChange(t.value);
                setOpen(false);
              }}
              className={`w-full px-4 py-2 text-sm flex items-center 
                justify-between text-gray-700 hover:bg-purple-50 transition`}
            >
              <div className="flex items-center gap-2">
                <t.icon size={17} className="text-gray-600" />
                {t.label}
              </div>

              {/* Check morado cuando está seleccionado */}
              {value === t.value && (
                <Check size={17} className="text-purple-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}




