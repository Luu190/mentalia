"use client";

import { useState } from "react";
import { useAccesibilidad } from "../context/AccesibilidadContext";
import { Minus, Plus, Volume2, VolumeX } from "lucide-react";

export default function AccesibilidadPanel() {
  const {
    fontSize,
    setFontSize,
    contrast,
    setContrast,
    voiceOn,
    toggleVoice,
  } = useAccesibilidad();

  const [open, setOpen] = useState(false);

  const disminuir = () => {
    if (fontSize > 12) setFontSize(fontSize - 2);
  };

  const aumentar = () => {
    if (fontSize < 24) setFontSize(fontSize + 2);
  };

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-40 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2 rounded-full shadow-lg text-sm font-semibold"
        aria-expanded={open}
        aria-label="Abrir panel de accesibilidad"
      >
        Accesibilidad
      </button>

      {/* PANEL */}
      {open && (
        <div className="fixed bottom-16 right-5 z-40 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-4">
          <h3 className="font-semibold mb-3 text-gray-900">Accesibilidad</h3>

          {/* Tamaño de fuente */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-800 mb-1">
              Tamaño de fuente
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={disminuir}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                aria-label="Disminuir tamaño de fuente"
              >
                <Minus size={16} />
              </button>
              <span className="text-sm text-gray-700">{fontSize}px</span>
              <button
                onClick={aumentar}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                aria-label="Aumentar tamaño de fuente"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Contraste */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-800 mb-1">Contraste</p>
            <select
              value={contrast}
              onChange={(e) => setContrast(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="standard">Estándar</option>
              <option value="high">Alto contraste</option>
              <option value="dark">Fondo oscuro</option>
            </select>
          </div>

          {/* Lectura por voz */}
          <div className="mb-1">
            <p className="text-sm font-medium text-gray-800 mb-1">
              Lectura por voz
            </p>
            <button
              onClick={toggleVoice}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition
                ${
                  voiceOn
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
            >
              {voiceOn ? <VolumeX size={16} /> : <Volume2 size={16} />}
              {voiceOn ? "Detener lectura" : "Leer página"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
