"use client";

import { useEffect, useState } from "react";

export default function LogsView() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/logs`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!res.ok) return;

        const data = await res.json();

        // ⚠️ Adaptar logs para que sean entendibles
        const beautified = data.logs.map((log) => ({
          _id: log._id,
          date: log.createdAt,
          action: beautifyAction(log)  // <<--- TRADUCE EL LOG A HUMANO
        }));

        setLogs(beautified);
      } catch (err) {
        console.error("Error cargando logs:", err);
      }
    }

    fetchLogs();
  }, []);

  // ⭐ Traduce endpoints/métodos a textos humanos
  function beautifyAction(log) {
    const url = log.endpoint || "";
    const method = log.method || "";

    if (url.includes("phrases")) return "Revisó frases de riesgo";
    if (url.includes("alerts/today")) return "Consultó alertas del día";
    if (url.includes("alerts")) return "Revisó alertas";
    if (url.includes("sessions/active")) return "Consultó sesiones activas";
    if (url.includes("stats/dashboard")) return "Consultó estadísticas del panel";
    if (url.includes("stats")) return "Consultó estadísticas generales";
    if (url.includes("admin/logs")) return "Consultó registros de actividad";

    return "Actividad registrada";
  }

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[900px]">
        
        <h2 className="text-2xl font-semibold mb-4 text-purple-700">
          Registros de Actividad
        </h2>

        {logs.length === 0 ? (
          <p className="text-gray-500">No hay registros todavía…</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2 text-left w-1/3">Fecha</th>
                <th className="py-2 text-left">Actividad</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b">
                  <td className="py-2">
                    {new Date(log.date).toLocaleString()}
                  </td>
                  <td className="py-2">{log.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
