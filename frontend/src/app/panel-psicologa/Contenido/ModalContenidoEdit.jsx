"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ModalContenidoEdit({ data, close, onUpdated }) {
  const inputStyle =
    "w-full px-4 py-2.5 bg-[#FAF9FF] border border-[#D6C8F5] rounded-xl text-sm focus:ring-2 focus:ring-[#B388F6] outline-none placeholder:text-gray-400";

  const selectStyle =
    "w-full px-4 py-2.5 bg-white border border-[#D6C8F5] rounded-xl text-sm focus:ring-2 focus:ring-[#B388F6] outline-none cursor-pointer";

  const [titulo, setTitulo] = useState(data.titulo || "");
  const [tipo, setTipo] = useState(data.tipo || "articulo");
  const [categoria, setCategoria] = useState(data.categoria || "general");
  const [descripcion, setDescripcion] = useState(data.descripcion || "");
  const [archivo, setArchivo] = useState(null);
  const [enlace, setEnlace] = useState(data.enlace || "");
  const [tecnicaTipo, setTecnicaTipo] = useState(data.tecnicaTipo || "otro");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!titulo.trim() || !descripcion.trim()) return;

    try {
      setLoading(true);
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const fd = new FormData();
      fd.append("titulo", titulo.trim());
      fd.append("descripcion", descripcion.trim());
      fd.append("tipo", tipo);
      fd.append("categoria", categoria);
      fd.append("enlace", enlace.trim());
      fd.append("tecnicaTipo", tecnicaTipo);

      if (archivo) {
        fd.append("archivo", archivo);
      }

      const res = await fetch(
        `${API_URL}/api/psychologist/content/${data._id}`,
        {
          method: "PUT",
          body: fd,
          credentials: "include",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        console.error("Error actualizando contenido:", txt);
        return;
      }

      onUpdated && onUpdated();
      close();
    } catch (err) {
      console.error("Error actualizando contenido:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-xl relative">
        {/* Cerrar */}
        <button
          onClick={close}
          className="absolute right-5 top-5 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-semibold mb-5">Editar Contenido</h2>

        <div className="flex flex-col gap-4">
          {/* TÍTULO */}
          <div>
            <label className="text-sm text-gray-600">Título</label>
            <input
              className={inputStyle}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          {/* TIPO + CATEGORÍA */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-sm text-gray-600">Tipo de Contenido</label>
              <select
                className={selectStyle}
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="articulo">Artículo / Tema</option>
                <option value="video">Video / Cápsula</option>
                <option value="tecnica">Técnica validada</option>
                <option value="recurso">Recurso externo</option>
              </select>
            </div>

            <div className="w-1/2">
              <label className="text-sm text-gray-600">Categoría</label>
              <select
                className={selectStyle}
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="ansiedad">Ansiedad</option>
                <option value="depresion">Depresión</option>
                <option value="estres">Estrés</option>
                <option value="mindfulness">Mindfulness</option>
                <option value="relaciones">Relaciones</option>
                <option value="estudio">Estudio</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>

          {/* TIPO DE TÉCNICA */}
          {tipo === "tecnica" && (
            <div>
              <label className="text-sm text-gray-600">
                Tipo de técnica (RF28)
              </label>
              <select
                className={selectStyle}
                value={tecnicaTipo}
                onChange={(e) => setTecnicaTipo(e.target.value)}
              >
                <option value="respiracion">Respiración consciente</option>
                <option value="journaling">Journaling</option>
                <option value="distraccion">Distracción cognitiva</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          )}

          {/* DESCRIPCIÓN */}
          <div>
            <label className="text-sm text-gray-600">
              Contenido / Descripción
            </label>
            <textarea
              className={`${inputStyle} h-28`}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          {/* ENLACE EXTERNO */}
          <div>
            <label className="text-sm text-gray-600">
              Enlace externo (podcast, libro, video sugerido)
            </label>
            <input
              className={inputStyle}
              value={enlace}
              onChange={(e) => setEnlace(e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* ARCHIVO */}
          <div>
            <label className="text-sm text-gray-600">
              Archivo (imagen, PDF o video — opcional)
            </label>

            <div className="flex gap-3">
              <input
                type="file"
                onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                className="
                  w-full px-4 py-[10px] bg-white border border-[#D6C8F5]
                  rounded-xl text-sm cursor-pointer
                "
              />
            </div>
          </div>

          {/* BOTÓN */}
          <button
            disabled={loading}
            onClick={handleUpdate}
            className="
            mt-2 bg-[#009C74] hover:bg-[#00845F] 
            disabled:opacity-60 disabled:cursor-not-allowed
            text-white py-2.5 rounded-xl w-full font-semibold 
            flex items-center justify-center gap-2 transition
          "
          >
            <Upload size={18} />
            {loading ? "Actualizando..." : "Actualizar Contenido"}
          </button>
        </div>
      </div>
    </div>
  );
}
