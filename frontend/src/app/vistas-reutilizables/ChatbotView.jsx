"use client";

import { useState, useEffect, useRef } from "react";
import { SendHorizonal, Bot } from "lucide-react";

// ⭐ RF6 — SessionId estable SOLO después de mount
export default function ChatbotView({ mode = "anonimo" }) {
  const [mounted, setMounted] = useState(false);
  const [anonSessionId, setAnonSessionId] = useState(null); // ← FIX
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tone, setTone] = useState("informal");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // ⭐ Ahora sí: sessionId se genera después de montar
  useEffect(() => {
    setMounted(true);

    if (mode === "anonimo") {
      let sid = sessionStorage.getItem("anonSessionId");
      if (!sid) {
        sid = "anon-" + crypto.randomUUID();
        sessionStorage.setItem("anonSessionId", sid);
      }
      setAnonSessionId(sid);
    }
  }, [mode]);

  // 🔹 Cargar tono para autenticados
  useEffect(() => {
    if (!mounted || mode !== "autenticado") return;

    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const user = JSON.parse(rawUser);
        if (user.tone === "formal" || user.tone === "informal") {
          setTone(user.tone);
        }
      }
    } catch (err) {
      console.error("Error leyendo tono de usuario:", err);
    }
  }, [mode, mounted]);

  // 🧹 RF6 — limpiar sesión anónima al cerrar pestaña
  useEffect(() => {
    if (mode !== "anonimo") return;

    const clearAnon = async () => {
      const sid = sessionStorage.getItem("anonSessionId");
      if (sid) {
        fetch(`${baseUrl}/api/sessions/end/${sid}`, { method: "POST" });
      }
      sessionStorage.removeItem("chatHistory");
      sessionStorage.removeItem("anonSessionId");
    };

    window.addEventListener("beforeunload", clearAnon);
    return () => window.removeEventListener("beforeunload", clearAnon);
  }, [mode]);

  // 📦 Cargar historial del chat
  useEffect(() => {
    if (!mounted) return;

    try {
      const storage = mode === "anonimo" ? sessionStorage : localStorage;
      const raw = storage.getItem("chatHistory");

      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
          return;
        }
      }

      // Mensaje inicial
      setMessages([
        {
          sender: "bot",
          text:
            mode === "anonimo"
              ? "💜 ¡Hola! Soy MENTALIA Bot. Estoy aquí para escucharte. ¿Cómo te sientes hoy?"
              : "🤍 ¡Hola! Soy MENTALIA Bot, tu compañero de apoyo emocional. ¿Cómo te sientes hoy?",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (e) {
      console.error("Error cargando historial:", e);
    }
  }, [mode, mounted]);

  // 💾 Guardar historial del chat
  useEffect(() => {
    if (!mounted) return;

    try {
      const storage = mode === "anonimo" ? sessionStorage : localStorage;
      storage.setItem("chatHistory", JSON.stringify(messages));
    } catch (e) {
      console.error("Error guardando historial:", e);
    }
  }, [messages, mode, mounted]);

  // 🔽 Autoscroll
  useEffect(() => {
    if (!mounted) return;
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping, mounted]);

  // 🧠 Enviar mensaje
  const sendMessage = async () => {
    if (!input.trim()) return;

    // 🚫 Evita requests duplicados
    if (isBotTyping) return;

    // ⚠️ FIX sesión anónima
    if (mode === "anonimo" && !anonSessionId) {
      console.warn("Esperando sessionId anónimo…");
      return;
    }

    const textToSend = input.trim();

    const userMessage = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((p) => [...p, userMessage]);
    setInput("");
    setIsBotTyping(true);

    const endpoint =
      mode === "anonimo"
        ? `${baseUrl}/api/chatbot/anonimo`
        : `${baseUrl}/api/chatbot/autenticado`;

    try {
     let userIdToSend = null;

if (mode === "autenticado") {
  try {
    const saved = JSON.parse(localStorage.getItem("user"));

    // Aseguramos TODAS las variantes posibles
    userIdToSend =
      saved?.id ||
      saved?._id ||
      saved?.userId ||
      saved?.data?._id ||
      null;

    console.log("📌 userId enviado al backend:", userIdToSend);
  } catch (e) {
    console.error("Error leyendo user:", e);
  }
}


      const bodyPayload = {
        message: textToSend,
        tone,
        userId: userIdToSend,
        sessionId: mode === "anonimo" ? anonSessionId : null,
      };

      // ⭐⭐⭐ IMPORTANTE — TOKEN PARA AUTENTICADOS ⭐⭐⭐
      let headers = { "Content-Type": "application/json" };

      if (mode === "autenticado") {
        const token = localStorage.getItem("token");
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(bodyPayload),
      });

      if (!res.ok) {
        throw new Error("Servidor no respondió correctamente");
      }

      const data = await res.json();
      setIsBotTyping(false);

      if (data.reply) {
        setMessages((p) => [
          ...p,
          {
            sender: "bot",
            text: data.reply,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    } catch (err) {
      console.error("Error procesando mensaje:", err);
      setIsBotTyping(false);

      setMessages((p) => [
        ...p,
        {
          sender: "bot",
          text:
            "⚠️ No se pudo conectar con el servidor. Intenta de nuevo más tarde.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[80vh] w-full bg-white rounded-2xl shadow-md overflow-hidden">
      {/* HEADER */}
      <header className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold rounded-t-2xl">
        <Bot className="w-6 h-6" />
        <div>
          <h2 className="text-sm">MENTALIA Bot</h2>
          <p className="text-xs opacity-90">
            Disponible 24/7 · Conversación confidencial
          </p>
        </div>

        <div className="ml-auto text-xs opacity-80">
          <span className="px-2 py-1 rounded-md bg-white/10">
            {mode === "anonimo" ? "Sesión temporal" : "Usuario autenticado"}
          </span>
        </div>
      </header>

      {/* TONO */}
      <div className="bg-gray-50 py-2 px-4 border-b flex items-center gap-4 text-xs text-gray-600">
        <span>Tono del chatbot:</span>

        <button
          onClick={() => setTone("informal")}
          className={`px-3 py-1 rounded-full text-xs border ${
            tone === "informal"
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white border-gray-300 text-gray-600"
          }`}
        >
          Informal
        </button>

        <button
          onClick={() => setTone("formal")}
          className={`px-3 py-1 rounded-full text-xs border ${
            tone === "formal"
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white border-gray-300 text-gray-600"
          }`}
        >
          Formal
        </button>
      </div>

      {/* INFO ANÓNIMO */}
      {mode === "anonimo" && (
        <div className="p-4 bg-indigo-50 border-b border-indigo-100">
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-4 text-sm text-indigo-700">
            <strong>Sesión Anónima Activa</strong>
            <p className="mt-1 text-xs text-indigo-600/90 leading-snug">
              Tu conversación es completamente confidencial y solo estará
              disponible durante esta sesión.
            </p>
          </div>
        </div>
      )}

      {/* CHAT */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-white">
        {messages.map((msg, i) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={i}
              className={`flex ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-3 max-w-[80%] break-words transition-all shadow-sm ${
                  isUser
                    ? "bg-purple-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.text}
                </p>
                <div className="text-[10px] mt-1 text-right opacity-70">
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}

        {isBotTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-2xl text-sm shadow-sm animate-pulse">
              MENTALIA Bot está escribiendo…
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* FOOTER */}
      <footer className="p-4 border-t bg-gray-50 rounded-b-2xl">
        <div className="flex gap-3 items-center">
          <textarea
            className="flex-1 border border-gray-200 rounded-full p-3 resize-none h-10 focus:ring-2 focus:ring-purple-300 focus:outline-none placeholder:text-gray-400"
            rows={1}
            value={input}
            placeholder="Escribe tu mensaje aquí..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            title="Enviar"
            className={`w-12 h-10 rounded-full flex items-center justify-center transition ${
              isLoading || !input.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              <SendHorizonal />
            )}
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-400">
          💡 Presiona Enter para enviar · Tu conversación es confidencial
        </div>
      </footer>
    </div>
  );
}
