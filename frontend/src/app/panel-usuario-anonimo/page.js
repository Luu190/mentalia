"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageCircle, BookOpen, LogOut } from "lucide-react";

import ChatbotView from "../vistas-reutilizables/ChatbotView";
import RecursosView from "../vistas-reutilizables/RecursosView";

export default function ChatPage() {
  const [activeView, setActiveView] = useState("chat");

  return (
    <div className="flex flex-col h-screen bg-[#f6f4fb]">

      {/* HEADER – ahora idéntico al de autenticados */}
      <header className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center px-8 py-4 shadow-md">
        {/* LOGO + TITULO */}
        <div className="flex items-center gap-2">
          <img
            src="/mentalialogo.png.png"
            alt="Logo Mentalia"
            className="w-7 h-7 object-contain"
          />

          <div className="leading-tight">
            <h1 className="text-base font-semibold tracking-wide">MENTALIA</h1>
            <p className="text-xs opacity-90">
              Plataforma de Apoyo Emocional - SENA
            </p>
          </div>
        </div>

        {/* USUARIO ANÓNIMO + LOGOUT */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="text-right leading-tight">
            <p className="font-semibold text-sm">Usuario Anónimo</p>
            <p className="opacity-90">anonimo@mentalia.com</p>
            <p className="">Sesión Temporal</p>
          </div>

          <button
            onClick={() => {
              sessionStorage.removeItem("chatHistory");
              sessionStorage.removeItem("anonSessionId");
              window.location.href = "/";
            }}
            className="flex items-center text-white bg-[#9f67ff] hover:bg-[#8b5cf6] px-3 py-2 rounded-md transition text-xs"
          >
            <LogOut size={16} />
          </button>
        </div>

      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <aside className="w-60 bg-white border-r border-gray-200 py-4 px-4 flex flex-col justify-between">
          <nav className="space-y-3">

            {/* Botón Chat */}
            <button
              onClick={() => setActiveView("chat")}
              className={`flex items-center w-full px-3 py-2 text-left text-sm rounded-md ${
                activeView === "chat"
                  ? "text-[#6b21a8] bg-purple-100"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <MessageCircle size={18} className="mr-2" /> Chat de Apoyo
            </button>

            {/* Botón Recursos */}
            <button
              onClick={() => setActiveView("recursos")}
              className={`flex items-center w-full px-3 py-2 text-left text-sm rounded-md ${
                activeView === "recursos"
                  ? "text-[#6b21a8] bg-purple-100"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BookOpen size={18} className="mr-2" /> Recursos y Técnicas
            </button>

          </nav>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 flex flex-col p-4 overflow-y-auto">
          {activeView === "chat" && <ChatbotView mode="anonimo" />}
          {activeView === "recursos" && <RecursosView />}
        </main>

      </div>
    </div>
  );
}


