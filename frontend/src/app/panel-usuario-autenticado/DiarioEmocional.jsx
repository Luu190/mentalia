"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, BookOpen, Calendar, Clock, Pencil, Trash2 } from "lucide-react";

import NuevaEntradaModal from "./NuevaEntradaModal";
import BuscadorEntradas from "./BuscadorEntradas";
import FiltroEstado from "./FiltroEstado";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const emotionColors = {
  Feliz: "bg-green-100 text-green-600",
  Normal: "bg-yellow-100 text-yellow-600",
  Triste: "bg-blue-100 text-blue-600",
  Ansioso: "bg-purple-100 text-purple-600",
  Enojado: "bg-red-100 text-red-600",
};

export default function DiarioEmocional() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");

  const [editingEntry, setEditingEntry] = useState(null);

  // 🔄 Cargar entradas
  useEffect(() => {
    async function cargarEntradas() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${baseUrl}/api/journal`, {
          method: "GET",
          credentials: "include",
          headers,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setEntries(data);
      } catch (err) {
        console.error("Error cargando entradas:", err);
        setError("No se pudieron cargar tus entradas.");
      } finally {
        setLoading(false);
      }
    }

    cargarEntradas();
  }, []);

  const formatFecha = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatHora = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 🔍 FILTRADO + BÚSQUEDA
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const matchEstado =
        filterEstado === "Todos" ? true : e.emotion === filterEstado;

      const safeTitle = e.title ?? "";
      const safeNote = e.note ?? "";
      const safeTags = Array.isArray(e.tags) ? e.tags.join(" ") : "";

      const texto = `${safeTitle} ${safeNote} ${safeTags}`.toLowerCase();

      const matchSearch = search.trim()
        ? texto.includes(search.trim().toLowerCase())
        : true;

      return matchEstado && matchSearch;
    });
  }, [entries, filterEstado, search]);

  // ❌ Eliminar
  const handleDelete = async (id) => {
    const confirmar = window.confirm("¿Seguro que quieres eliminar esta entrada?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${baseUrl}/api/journal/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Error eliminando entrada:", err);
      alert("No se pudo eliminar la entrada.");
    }
  };

  // ✏️ Editar
  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setMostrarModal(true);
  };

  // 🔁 Guardado
  const handleSaved = (saved) => {
    setEntries((prev) => {
      const exists = prev.find((e) => e._id === saved._id);
      if (exists) {
        return prev.map((e) => (e._id === saved._id ? saved : e));
      }
      return [saved, ...prev];
    });
    setEditingEntry(null);
  };

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-purple-600" size={28} />
            Diario Emocional
          </h1>
          <p className="text-gray-500 text-sm">
            Reflexiona sobre tus pensamientos y emociones cada día
          </p>
        </div>

        <button
          onClick={() => {
            setEditingEntry(null);
            setMostrarModal(true);
          }}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all shadow"
        >
          <Plus size={18} />
          Nueva entrada
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <BuscadorEntradas value={search} onChange={setSearch} />
        <FiltroEstado value={filterEstado} onChange={setFilterEstado} />
      </div>

      {loading && <p className="text-gray-500">Cargando tus entradas...</p>}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {!loading && !error && filteredEntries.length === 0 && (
        <p className="text-gray-500 text-sm">
          Aún no tienes entradas que coincidan con la búsqueda/filtros.
        </p>
      )}

      <div className="space-y-4">
        {filteredEntries.map((entrada) => (
          <div
            key={entrada._id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-gray-800">
                  {entrada.title}
                </h2>

                <div className="flex items-center gap-4 text-gray-500 text-sm mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {formatFecha(entrada.date)}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {formatHora(entrada.date)}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      emotionColors[entrada.emotion] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {entrada.emotion}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Pencil
                  size={20}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer"
                  onClick={() => handleEdit(entrada)}
                />
                <Trash2
                  size={20}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={() => handleDelete(entrada._id)}
                />
              </div>
            </div>

            <p className="text-gray-700 mt-4">{entrada.note}</p>

            <div className="flex gap-2 mt-4 flex-wrap">
              {(entrada.tags || []).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <NuevaEntradaModal
          onClose={() => {
            setMostrarModal(false);
            setEditingEntry(null);
          }}
          onSaved={handleSaved}
          initialData={editingEntry}
        />
      )}
    </div>
  );
}
