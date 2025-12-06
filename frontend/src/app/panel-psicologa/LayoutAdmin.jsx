"use client";

import { LogOut, Settings, BarChart3, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LayoutAdmin({ user, children, onChangeView, activeView }) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="h-screen flex flex-col bg-[#f6f4fb]">

      {/* HEADER */}
      <header className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center px-8 py-4 shadow-md">

        {/* LOGO + TITULO */}
        <div className="flex items-center gap-3">
          <img
            src="/mentalialogo.png.png"
            alt="Logo Mentalia"
            className="w-8 h-8 object-contain"
          />

          <div className="leading-tight">
            <h1 className="font-semibold text-base tracking-wide">MENTALIA</h1>
            <p className="text-xs opacity-80">Plataforma de Apoyo Emocional – SENA</p>
          </div>
        </div>

        {/* USUARIO ADMIN */}
        <div className="flex items-center gap-4 text-sm">
          <div className="text-right leading-tight">
            <p className="font-semibold">{user.nombre}</p>
            <p className="text-xs opacity-80">{user.email}</p>
            <p className="text-xs opacity-80">Psicóloga Institucional</p>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded hover:bg-white/20 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      {/* CONTENEDOR */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* SIDEBAR */}
        <aside className="min-w-[240px] max-w-[240px] bg-white shadow-md border-r p-6 shrink-0">
          <nav className="space-y-3">

            {/* BOTÓN PANEL ADMIN */}
            <button
              onClick={() => onChangeView("Dashboard")}
              className={`
                flex items-center gap-3 px-3 py-2 w-full rounded-md transition
                ${
                  activeView === "Dashboard"
                    ? "text-purple-600 font-medium bg-purple-100"
                    : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                }
              `}
            >
              <BarChart3
                size={18}
                className={activeView === "Dashboard" ? "text-purple-600" : "text-gray-500"}
              />
              <span className="text-sm">Panel Administrativo</span>
            </button>

            {/* BOTÓN CONFIGURACIÓN */}
            <button
              onClick={() => onChangeView("Ajustes")}
              className={`
                flex items-center gap-3 px-3 py-2 w-full rounded-md transition
                ${
                  activeView === "Ajustes"
                    ? "bg-purple-100 text-purple-600 font-medium shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                }
              `}
            >
              <Settings
                size={18}
                className={activeView === "Ajustes" ? "text-purple-600" : "text-gray-500"}
              />
              <span className="text-sm">Configuración</span>
            </button>

            {/* BOTÓN BÚSQUEDA — AHORA ALINEADO */}
            {/* BOTÓN BÚSQUEDA — AHORA ALINEADO */}
<button
  onClick={() => onChangeView("Busqueda")}
  className={`
    flex items-center gap-3 px-3 py-2 w-full rounded-md transition text-left
    ${
      activeView === "Busqueda"
        ? "bg-purple-100 text-purple-600 font-medium shadow-sm"
        : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
    }
  `}
>
  <Search
    size={18}
    className={activeView === "Busqueda" ? "text-purple-600" : "text-gray-500"}
  />
  <span className="text-sm">Búsqueda de conversaciones</span>
</button>


          </nav>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
