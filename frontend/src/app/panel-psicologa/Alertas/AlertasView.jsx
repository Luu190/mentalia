"use client";

import { useEffect, useState } from "react";
import TarjetaAlerta from "./TarjetaAlerta";
import FiltroAlertas from "./FiltroAlertas";
import ModalConversacion from "./ModalConversacion";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AlertasView() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("Todas las alertas");

  // ⭐ Modal conversación
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cargarAlertas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/psychologist/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      const adaptadas = data.map((a) => ({
        id: a._id,

        // ⭐ CORRECCIÓN 1 → YA NO ES "NORMAL"
        tipo: a.isCritical ? "CRÍTICA" : "ALTA PRIORIDAD",

        prioridad: a.severity || "medio",
        fecha: new Date(a.createdAt).toLocaleString(),
        descripcion: a.message,
        sesion: a.sessionId,
        estado: a.resolved ? "atendida" : "pendiente",

        conversationId: a.conversationId,
      }));

      setAlertas(adaptadas);
    } catch {
      setAlertas([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarAlertas();
  }, []);

  // ⭐ ATENDER ALERTA
  const atenderAlerta = async (alerta) => {
    try {
      const token = localStorage.getItem("token");

      // 1. Marcar como atendida en backend
      await fetch(`${API_URL}/api/psychologist/alerts/${alerta.id}/resolve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      // 2. Abrir conversación
      const res = await fetch(
        `${API_URL}/api/psychologist/alerts/${alerta.id}/conversation`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setSelectedConversation(data);
      setIsModalOpen(true);

      // 3. Actualizar frontend
      setAlertas((prev) =>
        prev.map((a) =>
          a.id === alerta.id ? { ...a, estado: "atendida" } : a
        )
      );
    } catch (err) {
      console.error("Error atendiendo alerta:", err);
    }
  };

  // ⭐ DESCARTAR ALERTA (solo frontend o backend si quieres)
  const descartarAlerta = (id) => {
    setAlertas((prev) => prev.filter((a) => a.id !== id));
  };

  // ⭐ Filtrado
  const alertasFiltradas = alertas.filter((a) => {
    if (filtro === "Todas las alertas") return true;
    if (filtro === "Críticas") return a.tipo === "CRÍTICA";

    // ⭐ CORRECCIÓN 2 → ALTA PRIORIDAD = NO críticas
    if (filtro === "Alta prioridad")
      return a.prioridad !== "alto";

    return true;
  });

  return (
    <div className="w-full mt-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Alertas Críticas</h2>
        <FiltroAlertas seleccion={filtro} setSeleccion={setFiltro} />
      </div>

      {loading && <p className="text-gray-500 text-sm">Cargando alertas...</p>}

      <div className="flex flex-col gap-6">
        {!loading &&
          alertasFiltradas.map((alerta) => (
            <TarjetaAlerta
              key={alerta.id}
              alerta={alerta}
              onAtender={() => atenderAlerta(alerta)}
              onDescartar={() => descartarAlerta(alerta.id)}
            />
          ))}
      </div>

      {!loading && alertasFiltradas.length === 0 && (
        <p className="text-gray-500 text-sm mt-4">
          No hay alertas que coincidan con el filtro seleccionado.
        </p>
      )}

      <ModalConversacion
        open={isModalOpen}
        conversation={selectedConversation}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
