"use client";

import { useEffect, useState } from "react";
import ModalAgregarFrase from "./ModalAgregarFrase";
import ModalEditarFrase from "./ModalEditarFrase";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function FrasesRiesgoView() {
  const [openModal, setOpenModal] = useState(false);
  const [frases, setFrases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editFrase, setEditFrase] = useState(null); // 🔥 MODAL DE EDICIÓN
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // ============================
  // 🔥 Cargar frases desde backend
  // ============================
  const cargarFrases = async () => {
    setLoading(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await fetch(`${API_URL}/api/psychologist/phrases`, {
        method: "GET",
        credentials: "include",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(
          "Error cargando frases:",
          res.status,
          res.statusText,
          text
        );
        return;
      }

      const data = await res.json();
      setFrases(data);
    } catch (err) {
      console.error("Error cargando frases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarFrases();
  }, []);

  // ============================
  // 🔥 Eliminar frase
  // ============================
  const eliminarFrase = async (id) => {
    if (!confirm("¿Eliminar esta frase?")) return;

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await fetch(
        `${API_URL}/api/psychologist/phrases/${id}`, // 🔥 CORREGIDO
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error(
          "Error eliminando frase:",
          res.status,
          res.statusText,
          text
        );
        return;
      }

      setFrases((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Error eliminando frase:", err);
    }
  };

  return (
    <div className="w-full mt-2">
      {/* TÍTULO + BOTÓN */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Gestión de Frases de Riesgo
        </h2>

        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 bg-[#009C74] hover:bg-[#00845F] text-white rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={18} />
          Agregar Frase
        </button>
      </div>

      {/* LOADING */}
      {loading && <p className="text-gray-500">Cargando frases...</p>}

      {/* LISTA VACÍA */}
      {!loading && frases.length === 0 && (
        <p className="text-gray-500 text-sm">
          No hay frases configuradas todavía.
        </p>
      )}

      {/* LISTA DE FRASES */}
      <div className="flex flex-col gap-4">
        {frases.map((frase) => (
          <div
            key={frase._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex justify-between items-start"
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                {/* Badge */}
                <span
                  className={`
                    px-3 py-1 text-xs font-semibold rounded-full
                    ${
                      frase.severity === "alto"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  `}
                >
                  {frase.severity.toUpperCase()}
                </span>

                <span className="text-xs text-gray-500">
                  Categoría: {frase.category}
                </span>
              </div>

              <p className="text-gray-900 font-medium text-sm">
                "{frase.text}"
              </p>
            </div>

            <div className="flex gap-3">
              {/* Editar */}
              <button
                onClick={() => setEditFrase(frase)} // 🔥 Abre el modal con la frase exacta
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-700"
              >
                <Pencil size={18} />
              </button>

              {/* Eliminar */}
              <button
                onClick={() => eliminarFrase(frase._id)}
                className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL AGREGAR */}
      {openModal && (
        <ModalAgregarFrase
          close={() => setOpenModal(false)}
          onAdd={cargarFrases}
        />
      )}

      {/* MODAL EDITAR */}
      {editFrase && (
        <ModalEditarFrase
          frase={editFrase}
          close={() => setEditFrase(null)}
          onUpdated={cargarFrases}
        />
      )}
    </div>
  );
}
