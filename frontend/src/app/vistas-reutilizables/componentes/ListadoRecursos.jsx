"use client";

import { FileText, Video, BookOpen, Headphones } from "lucide-react";

export default function ListadoRecursos({ recursos }) {
  if (!recursos || recursos.length === 0) {
    return (
      <div className="w-full text-center py-10 text-gray-500">
        No se encontraron recursos.
      </div>
    );
  }

  // Mapeo de íconos por tipo
  const iconosPorTipo = {
    PDF: FileText,
    Video: Video,
    Artículo: BookOpen,
    Podcast: Headphones,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {recursos.map((recurso) => {
        const Icono = iconosPorTipo[recurso.tipo] || FileText;

        return (
          <div
            key={recurso.id}
            className="p-5 rounded-xl border bg-white shadow-sm hover:shadow-md transition cursor-pointer"
          >
            {/* Icono principal */}
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                <Icono size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-lg text-gray-800">
                  {recurso.titulo}
                </h2>
                <p className="text-sm text-gray-500">{recurso.categoria}</p>
              </div>
            </div>

            {/* Descripción */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {recurso.descripcion || "Este recurso no tiene descripción."}
            </p>

            {/* Info extra */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                {recurso.tipo}
              </span>

              {recurso.duracion && (
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                  {recurso.duracion}
                </span>
              )}

              {recurso.estado && (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
                  {recurso.estado}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
