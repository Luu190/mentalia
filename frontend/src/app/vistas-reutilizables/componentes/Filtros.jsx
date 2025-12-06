"use client";

import { useState } from "react";
import { Filter, ListFilter, Layers } from "lucide-react";

export default function Filtros({ onChange }) {
  // Valores iniciales
  const [categoria, setCategoria] = useState("");
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState("");

  // Opciones
  const categorias = ["Ansiedad", "Autoestima", "Motivación", "Mindfulness", "Relaciones"];
  const tipos = ["PDF", "Video", "Artículo", "Podcast"];
  const estados = ["Nuevo", "Popular", "Recomendado"];

  const handleSelect = (setter, value, key) => {
    setter(value);
    onChange({ categoria, tipo, estado, [key]: value });
  };

  return (
    <div className="w-full space-y-6">

      {/* ---- Filtro de Categoría ---- */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Filter size={18} className="text-purple-600" />
          <h3 className="text-sm font-semibold text-gray-700">Categoría</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {categorias.map((c) => (
            <button
              key={c}
              onClick={() => handleSelect(setCategoria, c, "categoria")}
              className={
                "px-3 py-1.5 rounded-full text-sm border transition-all " +
                (categoria === c
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100")
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Filtro de Tipo ---- */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Layers size={18} className="text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-700">Tipo de recurso</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {tipos.map((t) => (
            <button
              key={t}
              onClick={() => handleSelect(setTipo, t, "tipo")}
              className={
                "px-3 py-1.5 rounded-full text-sm border transition-all " +
                (tipo === t
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100")
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Filtro de Estado ---- */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ListFilter size={18} className="text-green-600" />
          <h3 className="text-sm font-semibold text-gray-700">Estado</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {estados.map((e) => (
            <button
              key={e}
              onClick={() => handleSelect(setEstado, e, "estado")}
              className={
                "px-3 py-1.5 rounded-full text-sm border transition-all " +
                (estado === e
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100")
              }
            >
              {e}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
