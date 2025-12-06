"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  Heart,
  LogOut,
  Calendar,
  BarChart,
  BookOpen,
  Coffee,
  Bot,
  Notebook,
  TrendingUp,
} from "lucide-react";

import SettingsView from "../vistas-reutilizables/SettingsView";
import DiarioEmocional from "./DiarioEmocional";
import ChatbotView from "../vistas-reutilizables/ChatbotView";
import RecursosView from "../vistas-reutilizables/RecursosView";
import MiBienestar from "./Bienestar/MiBienestar";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Dashboard() {
  const router = useRouter();

  const [selectedMood, setSelectedMood] = useState("");
  const [activeView, setActiveView] = useState("Inicio");
  const [storedUser, setStoredUser] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);

  // ---------------------------
  // TOKEN SEGURO
  // ---------------------------
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  // ❤️ Guardar emoción rápida
  async function guardarMoodRapido(emotion) {
    try {
      if (!token) return console.warn("Token no cargado aún");

      const res = await fetch(`${baseUrl}/api/journal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "Estado del día",
          note: "Registro automático desde Inicio",
          emotion,
          intensity:
            emotion === "Feliz"
              ? 5
              : emotion === "Normal"
              ? 3
              : emotion === "Triste"
              ? 2
              : emotion === "Ansioso"
              ? 2
              : 1,
        }),
      });

      if (!res.ok) {
        console.error("No se pudo registrar emoción rápida");
        return;
      }

      console.log("Estado registrado automáticamente:", emotion);
    } catch (err) {
      console.error("Error guardando mood rápido:", err);
    }
  }

  // 🚫 Redirigir admin + cargar usuario
  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(rawUser);

      if (!user.consentimientoDatos) {
        alert("Debes aceptar el consentimiento informado para usar la plataforma.");
        router.push("/politicas/consentimiento");
        return;
      }

      if (user.rol === "admin") {
        router.replace("/panel-psicologa");
        return;
      }

      setStoredUser(user);
    } catch (e) {
      console.error("Error leyendo usuario:", e);
      router.push("/login");
    }
  }, [router]);

  // 🔥 Ping sesión
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${baseUrl}/api/sessions/ping`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 440 || res.status === 401) {
          alert("Tu sesión expiró por inactividad.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
        }
      } catch (err) {
        console.log("Error verificando sesión:", err);
      }
    }, 180000);

    return () => clearInterval(interval);
  }, [token, router]);

  // 📊 Semana emocional
  useEffect(() => {
    async function cargarSemana() {
      try {
        if (!token) return;

        const res = await fetch(`${baseUrl}/api/journal`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const entries = await res.json();

        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 6);

        const byDate = {};

        entries.forEach((e) => {
          const d = new Date(e.date);
          if (d < sevenDaysAgo || d > now) return;

          const key = d.toISOString().substring(0, 10);
          const intensity =
            e.intensity ??
            (e.emotion === "Feliz"
              ? 5
              : e.emotion === "Normal"
              ? 3
              : e.emotion === "Triste"
              ? 2
              : e.emotion === "Ansioso"
              ? 2
              : 1);

          if (!byDate[key]) byDate[key] = { sum: 0, count: 0 };
          byDate[key].sum += intensity;
          byDate[key].count += 1;
        });

        const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
        const temp = new Date(sevenDaysAgo);
        const result = [];

        for (let i = 0; i < 7; i++) {
          const key = temp.toISOString().substring(0, 10);
          const label = dayNames[temp.getDay()];

          let val = 0;
          if (byDate[key]) {
            val = byDate[key].sum / byDate[key].count;
          }

          result.push({ day: label, val: Number(val.toFixed(1)) });
          temp.setDate(temp.getDate() + 1);
        }

        setWeeklyData(result);
      } catch (err) {
        console.log("Error cargando semana emocional:", err);
      }
    }

    cargarSemana();
  }, [token]);

  // Último estado emocional
  useEffect(() => {
    async function cargarUltimoEstado() {
      try {
        if (!token) return;

        const res = await fetch(`${baseUrl}/api/journal`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const entries = await res.json();
        if (!entries || entries.length === 0) return;

        const sorted = entries.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        const ultimo = sorted[0];

        if (ultimo?.emotion) {
          setSelectedMood(ultimo.emotion);
        }
      } catch (err) {
        console.log("Error cargando último estado emocional:", err);
      }
    }

    cargarUltimoEstado();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const sidebarItems = [
    "Inicio",
    "Chatbot",
    "Mi Bienestar",
    "Diario Emocional",
    "Recursos",
    "Ajustes",
  ];

  if (!storedUser) return null;

  return (
    <div className="flex h-screen bg-[#f6f4fb] text-gray-800 flex-col">
      {/* HEADER */}
      <header className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center px-8 py-4 shadow-md">
        <div className="flex items-center space-x-3">
          <img 
            src="/mentalialogo.png.png" 
            alt="Logo Mentalia"
            className="w-8 h-8 object-contain"
          />
          <div>
            <h1 className="font-semibold text-base tracking-wide">MENTALIA</h1>
            <p className="text-xs opacity-80">
              Plataforma de Apoyo Emocional - SENA
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-sm">
          <div className="text-right">
            <p className="font-semibold leading-tight">
              {storedUser?.nombre || "Usuario"}
            </p>
            <p className="text-xs opacity-80">
              {storedUser?.email || "correo@ejemplo.com"}
            </p>
          </div>

          <button
            title="Cerrar sesión"
            className="p-2 rounded hover:bg-white/20 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-60 bg-white shadow-md flex flex-col p-4">
          <nav className="space-y-3">
            {sidebarItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveView(item)}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  activeView === item
                    ? "bg-purple-100 text-purple-700 font-medium"
                    : "hover:bg-purple-50"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
          {activeView === "Ajustes" && <SettingsView />}
          {activeView === "Diario Emocional" && <DiarioEmocional />}
          {activeView === "Recursos" && <RecursosView />}
          {activeView === "Chatbot" && <ChatbotView mode="autenticado" />}
          {activeView === "Mi Bienestar" && <MiBienestar />}

          {activeView === "Inicio" && (
            <>
              {/* Sección Inicio */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    ¡Hola, {storedUser?.nombre?.split(" ")[0]}! 👋
                  </h1>
                  <p>
                    ¿Cómo te sientes hoy? Tu bienestar emocional es importante
                    para nosotros.
                  </p>
                </div>
                <Image
                  src="/foto-inicio.jpg"
                  alt="foto"
                  width={280}
                  height={160}
                  className="rounded-xl object-cover"
                />
              </div>

              <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  ¿Cómo te sientes hoy?
                </h3>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  {["Feliz", "Normal", "Triste", "Ansioso"].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setSelectedMood(m);
                        guardarMoodRapido(m);
                      }}
                      className={`border rounded-xl py-3 text-center font-medium transition-all ${
                        selectedMood === m
                          ? {
                              Feliz:
                                "bg-green-100 border-green-400 text-green-700 border-2",
                              Normal:
                                "bg-yellow-100 border-yellow-400 text-yellow-700 border-2",
                              Triste:
                                "bg-blue-100 border-blue-400 text-blue-700 border-2",
                              Ansioso:
                                "bg-purple-100 border-purple-400 text-purple-700 border-2",
                            }[m]
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {selectedMood && (
                  <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-700 text-sm flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    Gracias por compartir cómo te sientes. Tu estado emocional
                    ha sido registrado.
                  </div>
                )}
              </div>

              {/* Semana emocional + Recordatorios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-green-600" />
                    Tu semana emocional
                  </h3>

                  {weeklyData.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Aún no hay suficientes registros para mostrar tu semana
                      emocional.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {weeklyData.map(({ day, val }) => (
                        <li
                          key={day}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{day}</span>

                          <div className="flex-1 mx-2 bg-purple-100 h-2 rounded-full">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${(val / 5) * 100}%` }}
                            ></div>
                          </div>

                          <span className="text-gray-600">
                            {val > 0 ? `${val.toFixed(1)}/5` : "-"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Recordatorios */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-yellow-500" />
                    Recordatorios
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex items-center gap-2">
                      <Coffee className="h-4 w-4 text-yellow-600" />
                      <span>
                        <span className="font-medium text-yellow-700">
                          Rutina matutina:
                        </span>{" "}
                        Tómate 5 minutos para respirar profundamente.
                      </span>
                    </li>
                    <li className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center gap-2">
                      <Notebook className="h-4 w-4 text-blue-600" />
                      <span>
                        <span className="font-medium text-blue-700">
                          Diario emocional:
                        </span>{" "}
                        Escribe sobre tu día antes de dormir.
                      </span>
                    </li>
                    <li className="bg-green-50 p-3 rounded-lg border border-green-100 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-green-600" />
                      <span>
                        <span className="font-medium text-green-700">
                          Autocuidado:
                        </span>{" "}
                        Recuerda hidratarte y tomar descansos.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* ✅ ACCIONES RÁPIDAS (restaurado) */}
              <section className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-4">
                  Acciones rápidas
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Hablar con el bot */}
                  <button
                    onClick={() => setActiveView("Chatbot")}
                    className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-purple-100 hover:border-purple-300 hover:shadow-md transition"
                  >
                    <div className="p-3 rounded-xl bg-purple-100">
                      <Bot className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">
                        Hablar con MENTALIA Bot
                      </p>
                      <p className="text-xs text-gray-500">
                        Conversa con nuestro asistente de apoyo emocional 24/7.
                      </p>
                    </div>
                  </button>

                  {/* Ver progreso / Mi bienestar */}
                  <button
                    onClick={() => setActiveView("Mi Bienestar")}
                    className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-purple-100 hover:border-purple-300 hover:shadow-md transition"
                  >
                    <div className="p-3 rounded-xl bg-green-100">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">
                        Ver mi progreso
                      </p>
                      <p className="text-xs text-gray-500">
                        Revisa tu evolución emocional de esta semana.
                      </p>
                    </div>
                  </button>

                  {/* Escribir en el diario */}
                  <button
                    onClick={() => setActiveView("Diario Emocional")}
                    className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-purple-100 hover:border-purple-300 hover:shadow-md transition"
                  >
                    <div className="p-3 rounded-xl bg-blue-100">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">
                        Escribir en mi diario
                      </p>
                      <p className="text-xs text-gray-500">
                        Reflexiona sobre tus pensamientos y emociones.
                      </p>
                    </div>
                  </button>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
