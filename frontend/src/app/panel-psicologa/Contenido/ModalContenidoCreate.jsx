"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ModalContenidoCreate({ close, onCreated }) {
  const inputStyle =
    "w-full px-4 py-2.5 bg-[#FAF9FF] border border-[#D6C8F5] rounded-xl text-sm focus:ring-2 focus:ring-[#B388F6] outline-none placeholder:text-gray-400";

  const selectStyle =
    "w-full px-4 py-2.5 bg-white border border-[#D6C8F5] rounded-xl text-sm focus:ring-2 focus:ring-[#B388F6] outline-none cursor-pointer";

  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("articulo");
  const [categoria, setCategoria] = useState("ansiedad");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [enlace, setEnlace] = useState("");
  const [tecnicaTipo, setTecnicaTipo] = useState("respiracion");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
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
        // campo "archivo" = el que espera multer
        fd.append("archivo", archivo);
      }

      const res = await fetch(`${API_URL}/api/psychologist/content`, {
        method: "POST",
        body: fd,
        credentials: "include",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Error guardando contenido:", txt);
        return;
      }

      onCreated && onCreated();
      close();
    } catch (err) {
      console.error("Error agregando contenido:", err);
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

        <h2 className="text-2xl font-semibold mb-5">Subir Nuevo Contenido</h2>

        <div className="flex flex-col gap-4">
          {/* TÍTULO */}
          <div>
            <label className="text-sm text-gray-600">Título</label>
            <input
              className={inputStyle}
              placeholder="Título del contenido..."
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
                <option value="recurso">Recurso externo (podcast/libro)</option>
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

          {/* TIPO DE TÉCNICA (solo si es técnica) */}
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
              placeholder="Describe el contenido o proporciona el guion de la técnica..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          {/* ENLACE EXTERNO (RF29) */}
          <div>
            <label className="text-sm text-gray-600">
              Enlace externo (podcast, libro, video sugerido)
            </label>
            <input
              className={inputStyle}
              placeholder="https://..."
              value={enlace}
              onChange={(e) => setEnlace(e.target.value)}
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
            onClick={handleSubmit}
            className="
            mt-2 bg-[#009C74] hover:bg-[#00845F] 
            disabled:opacity-60 disabled:cursor-not-allowed
            text-white py-2.5 rounded-xl w-full font-semibold 
            flex items-center justify-center gap-2 transition
          "
          >
            <Upload size={18} />
            {loading ? "Guardando..." : "Subir Contenido"}
          </button>
        </div>
      </div>
    </div>
  );
}
