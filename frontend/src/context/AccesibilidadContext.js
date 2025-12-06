"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AccesibilidadContext = createContext();

export function AccesibilidadProvider({ children }) {
  // Tamaño de fuente global
  const [fontSize, setFontSize] = useState(16); // px

  // Contraste global
  const [contrast, setContrast] = useState("standard"); // "standard" | "high" | "dark"

  // Lectura por voz
  const [voiceOn, setVoiceOn] = useState(false);

  /* === FONT SIZE === */
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty("--app-font-size", `${fontSize}px`);
  }, [fontSize]);

  /* === CONTRASTE === */
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.contrast = contrast;
  }, [contrast]);

  /* === LECTURA POR VOZ === */
  const stopReading = () => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
  };

  const startReading = () => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;

    stopReading();

    const text = document.body.innerText;
    if (!text || !text.trim()) return;

    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);

    // Intentar voz en español
    let voices = synth.getVoices();
    const spanish = voices.find((v) => v.lang.startsWith("es"));
    if (spanish) utter.voice = spanish;

    utter.lang = "es-ES";
    utter.rate = 1;
    utter.pitch = 1;

    synth.speak(utter);
    setVoiceOn(true);

    utter.onend = () => {
      setVoiceOn(false);
    };
  };

  const toggleVoice = () => {
    setVoiceOn((prev) => {
      const next = !prev;
      if (next) {
        startReading();
      } else {
        stopReading();
      }
      return next;
    });
  };

  const value = {
    fontSize,
    setFontSize,
    contrast,
    setContrast,
    voiceOn,
    toggleVoice,
    startReading,
    stopReading,
  };

  return (
    <AccesibilidadContext.Provider value={value}>
      {children}
    </AccesibilidadContext.Provider>
  );
}

export function useAccesibilidad() {
  return useContext(AccesibilidadContext);
}
