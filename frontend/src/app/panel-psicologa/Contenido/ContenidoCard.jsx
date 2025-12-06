"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import ModalVerContenido from "./ModalVerContenido";
import ModalContenidoEdit from "./ModalContenidoEdit";

export default function ContenidoCard({ data, onDelete, onUpdated }) {
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const fechaText = data.fecha
    ? new Date(data.fecha).toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : data.fecha || "";

  return (
    <>
      <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex justify-between items-start mb-4">
        {/* IZQUIERDA */}
        <div className="w-full pr-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#DFF0FF] text-[#0075C9]">
              {data.tipo}
            </span>

            <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
              {data.categoria}
            </span>

            {data.tipo === "tecnica" && data.tecnicaTipo && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                {data.tecnicaTipo}
              </span>
            )}
          </div>

          <h3 className="text-gray-900 font-semibold text-base mb-1">
            {data.titulo}
          </h3>

          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {data.descripcion}
          </p>

          <p className="text-gray-500 text-xs">
            Creado por {data.creador || "Psicóloga"} {fechaText && `el ${fechaText}`}
          </p>
        </div>

        {/* BOTONES */}
        <div className="flex gap-3">
          {/* Ver */}
          <button
            onClick={() => setOpenView(true)}
            className="
              p-2 rounded-lg bg-[#F7F7FB] 
              hover:bg-[#EDEDF3] 
              transition shadow-sm
            "
          >
            <Eye size={18} className="text-gray-600" />
          </button>

          {/* Editar */}
          <button
            onClick={() => setOpenEdit(true)}
            className="
              p-2 rounded-lg bg-[#F7F7FB] 
              hover:bg-[#EDEDF3] 
              transition shadow-sm
            "
          >
            <Pencil size={18} className="text-gray-600" />
          </button>

          {/* Eliminar */}
          <button
            onClick={() => onDelete && onDelete(data._id)}
            className="
              p-2 rounded-lg bg-[#FFF2F2] 
              hover:bg-[#FFE0E0] 
              transition shadow-sm
            "
          >
            <Trash2 size={18} className="text-red-600" />
          </button>
        </div>
      </div>

      {openView && (
        <ModalVerContenido data={data} close={() => setOpenView(false)} />
      )}

      {openEdit && (
        <ModalContenidoEdit
          data={data}
          close={() => setOpenEdit(false)}
          onUpdated={onUpdated}
        />
      )}
    </>
  );
}
