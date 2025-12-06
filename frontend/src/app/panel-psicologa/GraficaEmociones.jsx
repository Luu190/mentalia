"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// 🎨 Colores fijos por emoción normalizada
const EMOTION_COLORS = {
  tristeza: "#8b5cf6",
  ansiedad: "#f97316",
  estres: "#22c55e",
  miedo: "#0ea5e9",
  enojo: "#ef4444",
  preocupacion: "#eab308",
};

// 🔧 Normalizar emociones (sin tildes + minúsculas)
const normalize = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function GraficaEmociones() {
  const [emociones, setEmociones] = useState(null);

  const cargarStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/psychologist/stats/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error cargando stats del dashboard");

      const data = await res.json();

      const parsed =
        (data.emotions || [])
          .map((e) => {
            const raw = e._id || e.emotion || "desconocida";
            const emotion = normalize(raw);
            const count = e.total || e.count || 0;
            const color = EMOTION_COLORS[emotion] || "#a855f7";

            return { emotion, count, color };
          })
          .filter(
            (e) =>
              e.count > 0 &&
              e.emotion !== "neutral" &&
              e.emotion !== "crisis" &&
              e.emotion !== "desconocida"
          ) || [];

      setEmociones(parsed);
    } catch (err) {
      console.error("Error cargando emociones:", err);
      setEmociones([]);
    }
  };

  useEffect(() => {
    cargarStats();
  }, []);

  if (!emociones) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <p className="text-gray-500">Cargando emociones…</p>
      </div>
    );
  }

  if (emociones.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="font-semibold text-gray-700 mb-2 text-center">
          Emociones Más Detectadas
        </h3>
        <p className="text-gray-400 text-sm text-center">
          Aún no hay registros emocionales suficientes en la plataforma.
        </p>
      </div>
    );
  }

  const labels = emociones.map((e) => e.emotion);
  const values = emociones.map((e) => e.count);
  const colors = emociones.map((e) => e.color);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="font-semibold text-gray-700 mb-4 text-center">
        Emociones Más Detectadas
      </h3>

      <div className="flex justify-center items-center gap-14">
        <div className="w-52 h-52 flex justify-center items-center">
          <Pie data={data} options={options} />
        </div>

        <ul className="space-y-3 text-sm flex flex-col justify-center">
          {labels.map((label, i) => (
            <li key={i} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full block"
                style={{ backgroundColor: colors[i] }}
              ></span>
              <span className="font-semibold text-gray-700">{label}:</span>
              {values[i]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
