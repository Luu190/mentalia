"use client";

import { useEffect, useState, useMemo } from "react";
import {
  TrendingUp,
  PieChart,
  Calendar,
  Smile,
  Star,
  Bolt,
  Brain,
  Crosshair,
} from "lucide-react";

import EvolucionEmocionalChart from "../Bienestar/EvolucionEmocionalChart";
import DistribucionEmocionesChart from "../Bienestar/DistribucionEmocionesChart";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function emotionToIntensity(emotion) {
  switch (emotion) {
    case "Feliz":
      return 5;
    case "Normal":
      return 3;
    case "Triste":
      return 2;
    case "Ansioso":
      return 2;
    case "Enojado":
      return 1;
    default:
      return 3;
  }
}

export default function MiBienestar() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        setLoading(true);

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
        console.error("Error cargando journal en MiBienestar:", err);
        setError("No se pudo cargar tu información emocional.");
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, []);

  const {
    promedioSemanal,
    diasRegistrados,
    emocionPrincipal,
    evolucionLabels,
    evolucionValues,
    distribLabels,
    distribValues,
    insight1,
    insight2,
    insight3,
  } = useMemo(() => {
    // 🔥 Inicializar SIEMPRE para evitar errores
    let evolucionLabels = [];
    let evolucionValues = [];
    let distribLabels = [];
    let distribValues = [];

    if (!entries || entries.length === 0) {
      return {
        promedioSemanal: 0,
        diasRegistrados: 0,
        emocionPrincipal: "-",
        evolucionLabels,
        evolucionValues,
        distribLabels,
        distribValues,
        insight1: "Aún no hay suficientes datos.",
        insight2: "Registra tus emociones para ver patrones.",
        insight3: "Tu meta: registrar al menos 4 días a la semana.",
      };
    }

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6);

    const byDate = {};
    const byEmotion = {};

    entries.forEach((e) => {
      const d = new Date(e.date);
      const key = d.toISOString().substring(0, 10);
      const intensity = e.intensity ?? emotionToIntensity(e.emotion);

      if (d >= sevenDaysAgo && d <= now) {
        if (!byDate[key]) {
          byDate[key] = { sum: 0, count: 0 };
        }
        byDate[key].sum += intensity;
        byDate[key].count += 1;
      }

      if (!byEmotion[e.emotion]) byEmotion[e.emotion] = 0;
      byEmotion[e.emotion] += 1;
    });

    const diasRegistrados = Object.keys(byDate).length;

    const temp = new Date(sevenDaysAgo);
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    for (let i = 0; i < 7; i++) {
      const key = temp.toISOString().substring(0, 10);
      evolucionLabels.push(dayNames[temp.getDay()]);
      evolucionValues.push(
        byDate[key]
          ? Number((byDate[key].sum / byDate[key].count).toFixed(2))
          : 0
      );
      temp.setDate(temp.getDate() + 1);
    }

    const valoresValidos = evolucionValues.filter((v) => v > 0);
    const promedioSemanal =
      valoresValidos.length > 0
        ? valoresValidos.reduce((a, b) => a + b, 0) / valoresValidos.length
        : 0;

    let emocionPrincipal = "-";
    let maxCount = 0;

    Object.entries(byEmotion).forEach(([emo, count]) => {
      if (count > maxCount) {
        maxCount = count;
        emocionPrincipal = emo;
      }
    });

    distribLabels = Object.keys(byEmotion);
    distribValues = Object.values(byEmotion);

    const insight1 =
      promedioSemanal >= 4
        ? "Tu bienestar se mantiene alto esta semana. 🌈"
        : promedioSemanal >= 3
        ? "Tu bienestar es estable, pero puedes cuidar algunos días."
        : "Sería bueno que dediques tiempo a ti misma esta semana.";

    const insight2 =
      diasRegistrados >= 5
        ? "Has registrado emociones en al menos 5 días. ¡Gran constancia! 🧘‍♀️"
        : diasRegistrados >= 3
        ? "Vas tomando el hábito, sigue registrando tus días."
        : "Comienza registrando cómo te sientes al menos 3 veces por semana.";

    const remaining = Math.max(0, 4 - diasRegistrados);
    const insight3 =
      remaining === 0
        ? "Has cumplido tu meta semanal de registros. 🎯"
        : `Estás a solo ${remaining} registro(s) de tu meta semanal de 4 días.`;

    return {
      promedioSemanal,
      diasRegistrados,
      emocionPrincipal,
      evolucionLabels,
      evolucionValues,
      distribLabels,
      distribValues,
      insight1,
      insight2,
      insight3,
    };
  }, [entries]);

  return (
    <div className="space-y-8">
      {/* TÍTULO */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Bienestar Emocional</h1>
        <p className="text-gray-600 -mt-1">Seguimiento y análisis de tu estado emocional</p>
      </div>

      {loading && <p className="text-gray-500 text-sm">Cargando datos...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* TARJETAS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* tarjeta 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Promedio Semanal</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-3xl font-bold text-purple-600">
              {promedioSemanal.toFixed(1)}/5
            </p>
            <Smile className="h-8 w-8 text-purple-500 bg-purple-100 p-2 rounded-full" />
          </div>
          <p className="text-green-600 text-sm mt-2">
            {promedioSemanal >= 3.5
              ? "+ Tendencia positiva frente a semanas anteriores."
              : "Aún puedes mejorar tu promedio esta semana."}
          </p>
        </div>

        {/* tarjeta 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Días Registrados</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-3xl font-bold text-indigo-600">
              {diasRegistrados}/7
            </p>
            <Calendar className="h-8 w-8 text-indigo-500 bg-indigo-100 p-2 rounded-full" />
          </div>
        </div>

        {/* tarjeta 3 */}
        <div className="bg:white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Emoción Principal</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-3xl font-bold text-green-600">
              {emocionPrincipal}
            </p>
            <Star className="h-8 w-8 text-green-500 bg-green-100 p-2 rounded-full" />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Basado en tus registros de la última semana.
          </p>
        </div>
      </div>

      {/* GRÁFICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Evolución emocional
          </p>

          {evolucionLabels.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Aún no hay registros suficientes para mostrar la gráfica.
            </p>
          ) : (
            <EvolucionEmocionalChart
              labels={evolucionLabels}
              values={evolucionValues}
            />
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-600" />
            Distribución de emociones
          </p>

          {distribLabels.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Registra algunas emociones para ver tu distribución.
            </p>
          ) : (
            <DistribucionEmocionesChart
              labels={distribLabels.map(
                (label, idx) =>
                  `${label} (${distribValues[idx]} registro${
                    distribValues[idx] !== 1 ? "s" : ""
                  })`
              )}
              values={distribValues}
            />
          )}
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Bolt className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-800">
            Insights Personalizados
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Insight 1 */}
          <div className="flex items-start gap-4 border rounded-xl p-4 bg-white">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-green-100">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Tendencia</p>
              <p className="text-gray-600 text-sm mt-1">{insight1}</p>
            </div>
          </div>

          {/* Insight 2 */}
          <div className="flex items-start gap-4 border rounded-xl p-4 bg-white">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-100">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Mindfulness</p>
              <p className="text-gray-600 text-sm mt-1">{insight2}</p>
            </div>
          </div>

          {/* Insight 3 */}
          <div className="flex items-start gap-4 border rounded-xl p-4 bg:white">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-100">
              <Crosshair className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Meta semanal</p>
              <p className="text-gray-600 text-sm mt-1">{insight3}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
