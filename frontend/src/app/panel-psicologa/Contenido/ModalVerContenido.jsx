"use client";

import { X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ModalVerContenido({ data, close }) {
  const fileUrl = data.archivoUrl ? `${API_URL}${data.archivoUrl}` : null;

  const fechaText = data.fecha
    ? new Date(data.fecha).toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 shadow-xl relative">
        <button
          onClick={close}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Ver Contenido</h2>

        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#DFF0FF] text-[#0075C9]">
            {data.tipo}
          </span>

          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
            {data.categoria}
          </span>

          {data.tecnicaTipo && data.tipo === "tecnica" && (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
              {data.tecnicaTipo}
            </span>
          )}
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          {data.titulo}
        </h3>

        <p className="text-gray-500 text-xs mb-3">
          Creado por {data.creador || "Psicóloga"}{" "}
          {fechaText && <>el {fechaText}</>}
        </p>

        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {data.descripcion}
        </p>

        {/* Enlace externo */}
        {data.enlace && (
          <a
            href={data.enlace}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center text-sm text-[#0075C9] hover:underline mb-3"
          >
            Abrir recurso recomendado
          </a>
        )}

        {/* Archivo subido */}
        {fileUrl && (
          <div className="mt-2">
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-sm text-emerald-600 hover:underline"
            >
              Ver archivo adjunto
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
