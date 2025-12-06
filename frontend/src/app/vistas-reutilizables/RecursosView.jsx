"use client";

import { useEffect, useState } from "react";
import { Play, FileText, Link2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RecursosView() {
  const [recursos, setRecursos] = useState([]);
  const [categoria, setCategoria] = useState("todos");
  const [tipo, setTipo] = useState("todos");
  const [buscar, setBuscar] = useState("");

  const cargar = async () => {
    const params = new URLSearchParams();

    if (categoria !== "todos") params.set("categoria", categoria);
    if (tipo !== "todos") params.set("tipo", tipo);
    if (buscar.trim()) params.set("buscar", buscar.trim());

    const res = await fetch(`${API_URL}/api/content?${params}`);
    const data = await res.json();
    setRecursos(data);
  };

  useEffect(() => {
    cargar();
  }, [categoria, tipo]);

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-semibold">Recursos de Bienestar</h2>
      <p className="text-gray-500 mb-6">
        Herramientas y contenido para tu crecimiento emocional
      </p>

      {/* FILTROS */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          className="flex-1 px-4 py-2 rounded-xl border"
          placeholder="Buscar recursos…"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />

        <select
          className="px-4 py-2 rounded-xl border"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="todos">Todos los tipos</option>
          <option value="articulo">Artículo</option>
          <option value="video">Video</option>
          <option value="tecnica">Técnica</option>
          <option value="recurso">Recurso externo</option>
        </select>

        <select
          className="px-4 py-2 rounded-xl border"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="todos">Todas las categorías</option>
          <option value="ansiedad">Ansiedad</option>
          <option value="estres">Estrés</option>
          <option value="mindfulness">Mindfulness</option>
          <option value="general">General</option>
        </select>

        <button
          onClick={cargar}
          className="px-4 py-2 rounded-xl bg-purple-600 text-white"
        >
          Buscar
        </button>
      </div>

      {/* LISTADO */}
      {recursos.length === 0 ? (
        <p className="text-gray-500">No hay contenido disponible.</p>
      ) : (
        <div className="flex flex-wrap gap-8">
          {recursos.map((item) => (
            <RecursoCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
📌 TARJETA — IGUAL A FIGMA
========================================================= */
function RecursoCard({ item }) {
  const esVideo = item.tipo === "video";
  const esArticulo = item.tipo === "articulo";
  const esTecnica = item.tipo === "tecnica";
  const esLinkExterno = item.enlace && !item.archivoUrl;

  const imagen =
    item.archivoUrl ||
    "https://images.pexels.com/photos/322552/pexels-photo-322552.jpeg";

  const abrirRecurso = () => {
    if (esVideo || esLinkExterno) {
      window.open(item.enlace, "_blank");
    } else if (item.archivoUrl) {
      window.open(item.archivoUrl, "_blank");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden w-[330px] cursor-pointer hover:shadow-xl transition"
      onClick={abrirRecurso}
    >
      {/* Imagen */}
      <div className="relative h-[180px] w-full">
        <img
          src={imagen}
          alt="imagen recurso"
          className="object-cover w-full h-full"
        />

        {/* Tipo */}
        <span className="absolute top-3 left-3 bg-indigo-100 text-indigo-700 px-3 py-[3px] rounded-full text-sm capitalize">
          {item.tipo}
        </span>

        {/* Gratis */}
        <span className="absolute top-3 right-3 bg-green-100 text-green-700 px-3 py-[3px] rounded-full text-sm">
          Gratis
        </span>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{item.titulo}</h3>

        <p className="text-gray-600 mt-2 line-clamp-3">{item.descripcion}</p>

        {/* Categoría */}
        <div className="mt-3">
          <span className="bg-purple-100 text-purple-700 px-3 py-[3px] rounded-full text-sm capitalize">
            {item.categoria}
          </span>
        </div>

        {/* Botón */}
        <button
          className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
        >
          {esVideo ? <Play size={18} /> : null}
          {esArticulo ? <FileText size={18} /> : null}
          {esLinkExterno ? <Link2 size={18} /> : null}
          Ver recurso
        </button>
      </div>
    </div>
  );
}
