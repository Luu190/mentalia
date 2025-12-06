"use client";

import { useEffect, useState } from "react";
import { Users, LineChart, BarChart3, AlertTriangle } from "lucide-react";

export default function EstadisticasCards() {
  const [stats, setStats] = useState({
    users: 0,
    activeSessions: 0,
    chatbotSessions: 0,
    alertsToday: 0
  });

  useEffect(() => {
    async function cargarDatos() {
      const token = localStorage.getItem("token");
      const API = process.env.NEXT_PUBLIC_API_URL;

      try {
        // 1. Estadísticas del backend
        const resStats = await fetch(`${API}/api/psychologist/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataStats = await resStats.json();

        // 2. Sesiones activas (CORRECTO, SIN :1)
        const resActive = await fetch(`${API}/api/psychologist/sessions/active`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataActive = await resActive.json();

        // 3. Alertas de hoy
        const resToday = await fetch(`${API}/api/psychologist/alerts/today`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataToday = await resToday.json();

        setStats({
          users: dataStats.usersCount || 0,
          activeSessions: dataActive.count || 0,
          chatbotSessions: dataStats.chatbotUsage || 0,
          alertsToday: dataToday.count || 0
        });

      } catch (err) {
        console.error("Error cargando estadísticas:", err);
      }
    }

    cargarDatos();
  }, []);

  const items = [
    { title: "Usuarios Totales", value: stats.users, icon: <Users className="text-purple-600 w-8 h-8" /> },
    { title: "Sesiones Activas", value: stats.activeSessions, icon: <LineChart className="text-blue-600 w-8 h-8" /> },
    { title: "Sesiones Chatbot", value: stats.chatbotSessions, icon: <BarChart3 className="text-purple-600 w-8 h-8" /> },
    { title: "Alertas Hoy", value: stats.alertsToday, icon: <AlertTriangle className="text-red-600 w-8 h-8" /> }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      {items.map((s) => (
        <div
          key={s.title}
          className="bg-white shadow-sm rounded-xl p-5 border border-gray-200 flex justify-between items-center"
        >
          <div>
            <p className="text-sm text-gray-500">{s.title}</p>
            <h2 className="text-2xl font-semibold mt-2 text-gray-900">{s.value}</h2>
          </div>
          {s.icon}
        </div>
      ))}
    </div>
  );
}
