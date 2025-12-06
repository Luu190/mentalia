"use client";

import { useEffect, useState } from "react";
import { Monitor, Smartphone, Laptop, LogOut, XCircle } from "lucide-react";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function guessDeviceType(userAgent = "") {
  if (!userAgent) return "Desktop";

  const ua = userAgent.toLowerCase();
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
    return "Smartphone";
  }
  if (ua.includes("windows") || ua.includes("macintosh") || ua.includes("linux")) {
    return "Laptop";
  }
  return "Desktop";
}

function getIcon(type) {
  switch (type) {
    case "Smartphone":
      return <Smartphone className="text-purple-600 w-5 h-5" />;
    case "Laptop":
      return <Laptop className="text-purple-600 w-5 h-5" />;
    default:
      return <Monitor className="text-purple-600 w-5 h-5" />;
  }
}

export default function SettingsView() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const currentSessionId =
    typeof window !== "undefined" ? localStorage.getItem("sessionId") : null;

  // ================================
  // Cargar sesiones activas
  // ================================
  useEffect(() => {
    if (!token) {
      setMsg("No hay sesión activa.");
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/sessions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setMsg(data.msg || "No se pudieron cargar las sesiones");
        } else {
          setSessions(data || []);
        }
      } catch (err) {
        setMsg("Error al cargar las sesiones");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [token]);

  // ================================
  // Cerrar SOLO esta sesión
  // ================================
  const handleCloseCurrent = async () => {
    if (!token || !currentSessionId) return;

    try {
      await fetch(`${baseUrl}/api/sessions/${currentSessionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("sessionId");
      window.location.href = "/login";
    } catch {
      setMsg("Error al cerrar la sesión actual.");
    }
  };

  // ================================
  // Cerrar SESIÓN INDIVIDUAL
  // ================================
  const handleCloseOne = async (id) => {
    try {
      await fetch(`${baseUrl}/api/sessions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setSessions((prev) => prev.filter((s) => s._id !== id));
    } catch {
      setMsg("No se pudo cerrar esa sesión.");
    }
  };

  // ================================
  // Cerrar TODAS
  // ================================
  const handleCloseAll = async () => {
    try {
      await fetch(`${baseUrl}/api/sessions/logout-all`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("sessionId");

      window.location.href = "/login";
    } catch {
      setMsg("Error al cerrar todas las sesiones.");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          Seguridad y Sesiones
        </h2>

        <button
          onClick={handleCloseAll}
          className="text-xs font-medium text-red-500 hover:text-red-600 border border-red-200 px-3 py-1 rounded-full"
        >
          Cerrar todas las sesiones
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Aquí puedes ver tus dispositivos con sesión activa en{" "}
        <span className="text-purple-600 font-medium">MENTALIA</span>.
      </p>

      {msg && <p className="text-xs text-center text-red-500 mb-3">{msg}</p>}

      {loading ? (
        <p className="text-sm text-gray-400">Cargando sesiones...</p>
      ) : sessions.length === 0 ? (
        <p className="text-sm text-gray-400">No hay sesiones activas.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => {
            const type = guessDeviceType(s.userAgent);
            const isCurrent = s.sessionId === currentSessionId;

            return (
              <div
                key={s._id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isCurrent
                    ? "border-purple-400 bg-purple-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white rounded-full p-2 shadow-sm">
                    {getIcon(type)}
                  </div>

                  <div>
                    <p className="font-medium text-gray-800">
                      {isCurrent ? "Este dispositivo" : "Otro dispositivo"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {s.userAgent || "Navegador no identificado"}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(s.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {isCurrent ? (
                  <button
                    onClick={handleCloseCurrent}
                    className="text-sm text-purple-700 hover:text-purple-900 flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar aquí
                  </button>
                ) : (
                  <button
                    onClick={() => handleCloseOne(s.sessionId)}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
