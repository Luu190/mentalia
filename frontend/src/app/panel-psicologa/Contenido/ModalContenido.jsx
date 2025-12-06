"use client";

import { X } from "lucide-react";

export default function ModalContenidoCreate({ close }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-xl relative">

        {/* Cerrar */}
        <button
          onClick={close}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Subir Nuevo Contenido</h2>

        <div className="flex flex-col gap-5">

          {/* Título */}
          <input
            placeholder="Título del contenido..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring focus:ring-purple-200"
          />

          {/* TIPO + CATEGORÍA */}
          <div className="flex gap-3">

            <select className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Artículo</option>
              <option>Video</option>
              <option>Técnica</option>
            </select>

            <select className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="ansiedad">Ansiedad</option>
              <option value="depresión">Depresión</option>
              <option value="estrés">Estrés</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="relaciones">Relaciones</option>
              <option value="estudio">Estudio</option>
            </select>
          </div>

          {/* DESCRIPCIÓN */}
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-28"
            placeholder="Describe el contenido o pega el enlace del video…"
          />

          {/* IMAGEN */}
          <div className="flex gap-2">
            <input
              type="file"
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />

            <input
              placeholder="URL de la imagen..."
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Botón */}
          <button className="mt-2 bg-[#009C74] hover:bg-[#00845F] text-white py-2 rounded-lg text-sm font-medium shadow">
            Subir Contenido
          </button>
        </div>
      </div>
    </div>
  );
}




