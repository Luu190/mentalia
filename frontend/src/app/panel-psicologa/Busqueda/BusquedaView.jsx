"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BusquedaView() {
  const [keyword, setKeyword] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setResultados([]);

    const palabra = keyword.trim();

    if (!palabra) {
      setError("Por favor ingresa una palabra clave para buscar.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/psychologist/conversations/search?keyword=${encodeURIComponent(
          palabra
        )}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error al buscar en las conversaciones.");
      }

      const data = await res.json();
      setResultados(data || []);
    } catch (err) {
      console.error("ERROR RF21:", err);
      setError("Ocurrió un error al realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-2">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Buscar palabras clave en conversaciones
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Esta herramienta permite localizar rápidamente conversaciones donde se mencionan
            palabras asociadas a crisis psicológicas.
          </p>
        </div>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mb-6">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Ej: morir, daño, sufrimiento..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          type="submit"
          disabled={loading}
          className={`
            px-6 py-2 rounded-xl text-sm font-medium text-white
            ${loading ? "bg-purple-300 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}
            transition
          `}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {/* MENSAJES DE ESTADO */}
      {error && (
        <p className="text-sm text-red-500 mb-3">
          {error}
        </p>
      )}

      {!error && !loading && resultados.length === 0 && keyword.trim() !== "" && (
        <p className="text-sm text-gray-500">
          No se encontraron resultados para la palabra ingresada.
        </p>
      )}

      {/* RESULTADOS */}
      {resultados.length > 0 && (
        <div className="mt-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Resultados encontrados ({resultados.length})
          </h3>

          {resultados.map((conv) => (
            <div
              key={conv._id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <p className="text-xs text-gray-400 mb-1">
                ID de sesión:{" "}
                <span className="font-mono text-gray-500">{conv.sessionId}</span>
              </p>

              {conv.matches && conv.matches.length > 0 && (
                <ul className="mt-2 space-y-2">
                  {conv.matches.map((m, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
                    >
                      <span className="font-semibold">
                        {m.sender === "user" ? "Usuario:" : "Chatbot:"}
                      </span>{" "}
                      {m.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
