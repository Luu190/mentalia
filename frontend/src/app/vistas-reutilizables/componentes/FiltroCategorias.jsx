"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Check,
  HeartPulse,
  Frown,
  AlertTriangle,
  Flower2,
  Users,
  BookOpen,
  Tags,
} from "lucide-react";

export default function FiltroCategorias({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categorias = [
    { label: "Todas las categorías", value: "todas", icon: Tags },
    { label: "Ansiedad", value: "Ansiedad", icon: HeartPulse },
    { label: "Depresión", value: "Depresión", icon: Frown },
    { label: "Estrés", value: "Estrés", icon: AlertTriangle },
    { label: "Mindfulness", value: "Mindfulness", icon: Flower2 }, // 🔥 reemplazo seguro
    { label: "Relaciones", value: "Relaciones", icon: Users },
    { label: "Estudio", value: "Estudio", icon: BookOpen },
  ];

  const selectedCat = categorias.find((c) => c.value === value) || categorias[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="border border-gray-300 rounded-xl px-4 py-2 bg-white 
        flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition shadow-sm"
      >
        <selectedCat.icon size={18} className="text-purple-500" />
        <span className="text-sm">{selectedCat.label}</span>
        <ChevronDown size={18} className="text-gray-500" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white shadow-lg 
        rounded-xl border border-gray-200 py-2 z-20"
        >
          {categorias.map((c) => (
            <button
              key={c.value}
              onClick={() => {
                onChange(c.value);
                setOpen(false);
              }}
              className="w-full px-4 py-2 text-sm flex items-center 
              justify-between text-gray-700 hover:bg-purple-50 transition"
            >
              <div className="flex items-center gap-2">
                <c.icon size={18} className="text-gray-600" />
                {c.label}
              </div>

              {value === c.value && (
                <Check size={17} className="text-purple-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}




