"use client";

import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import ContenidoCard from "./ContenidoCard";
import ModalContenidoCreate from "./ModalContenidoCreate";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ContenidoView() {
  const [openModal, setOpenModal] = useState(false);
  const [contenido, setContenido] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [orden, setOrden] = useState("fecha");

  const cargarContenido = async () => {
    try {
      setLoading(true);
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await fetch(`${API_URL}/api/psychologist/content`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Error cargando contenido:", res.status, txt);
        return;
      }

      const data = await res.json();
      setContenido(data);
    } catch (err) {
      console.error("Error cargando contenido:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarContenido();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este contenido?")) return;

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await fetch(`${API_URL}/api/psychologist/content/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Error eliminando contenido:", res.status, txt);
        return;
      }

      setContenido((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error eliminando contenido:", err);
    }
  };

  const listaOrdenadaFiltrada = () => {
    let lista = [...contenido];

    if (filtroTipo !== "todos") {
      lista = lista.filter((c) => c.tipo === filtroTipo);
    }
    if (filtroCategoria !== "todos") {
      lista = lista.filter((c) => c.categoria === filtroCategoria);
    }

    lista.sort((a, b) => {
      if (orden === "tipo") return a.tipo.localeCompare(b.tipo);
      if (orden === "categoria") return a.categoria.localeCompare(b.categoria);
      // fecha
      return new Date(b.fecha) - new Date(a.fecha);
    });

    return lista;
  };

  const dataMostrada = listaOrdenadaFiltrada();

  return (
    <div className="w-full mt-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Gestión de Contenido
          </h2>
          <p className="text-xs text-gray-500">
            Registra artículos, videos, técnicas y recursos recomendados.
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 bg-[#009C74] hover:bg-[#00845F] text-white rounded-lg flex items-center gap-2 shadow-md transition"
        >
          <Upload size={18} />
          Subir Contenido
        </button>
      </div>

      {/* Filtros / orden */}
      <div className="flex flex-wrap gap-3 mb-4 text-sm">
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option value="todos">Todos los tipos</option>
          <option value="articulo">Artículos</option>
          <option value="video">Videos</option>
          <option value="tecnica">Técnicas</option>
          <option value="recurso">Recursos (podcasts / libros)</option>
        </select>

        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option value="todos">Todas las categorías</option>
          <option value="ansiedad">Ansiedad</option>
          <option value="depresion">Depresión</option>
          <option value="estres">Estrés</option>
          <option value="mindfulness">Mindfulness</option>
          <option value="relaciones">Relaciones</option>
          <option value="estudio">Estudio</option>
          <option value="general">General</option>
        </select>

        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option value="fecha">Ordenar por fecha</option>
          <option value="tipo">Ordenar por tipo</option>
          <option value="categoria">Ordenar por categoría</option>
        </select>
      </div>

      {/* Lista */}
      {loading && <p className="text-gray-500 text-sm">Cargando contenido…</p>}

      {!loading && dataMostrada.length === 0 && (
        <p className="text-gray-500 text-sm">No hay contenido todavía.</p>
      )}

      <div className="w-full">
        {dataMostrada.map((item) => (
          <ContenidoCard
            key={item._id}
            data={item}
            onDelete={handleDelete}
            onUpdated={cargarContenido}
          />
        ))}
      </div>

      {openModal && (
        <ModalContenidoCreate
          close={() => setOpenModal(false)}
          onCreated={cargarContenido}
        />
      )}
    </div>
  );
}
