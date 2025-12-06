"use client";

import { X, Clock } from "lucide-react";

export default function ModalVerRecurso({ open, close, data }) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className="bg-white rounded-2xl w-full 
        max-w-xl       /* modal más pequeño */
        max-h-[80vh] 
        overflow-y-auto p-6 shadow-xl relative"
      >

        {/* Botón cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          onClick={close}
        >
          <X size={22} />
        </button>

        {/* Título */}
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {data.titulo}
        </h2>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-4">

          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
            {data.tipo}
          </span>

          <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 font-semibold">
            {data.categoria}
          </span>

          {/* Tiempo */}
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <Clock size={15} />
            {data.tiempo}
          </div>
        </div>

        {/* Imagen */}
        {data.imagen && (
          <img
            src={data.imagen}
            className="w-full rounded-xl mb-4 shadow"
            alt="Recurso"
          />
        )}

        {/* Descripción */}
        <div className="text-gray-800 leading-relaxed whitespace-pre-line text-sm">
          {data.descripcion}
        </div>

        {/* Botón Cerrar */}
        <div className="flex justify-end mt-6">
          <button
            onClick={close}
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition text-sm"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}




