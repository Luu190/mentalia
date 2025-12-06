"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:4000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.msg || "Ocurrió un error, intenta nuevamente.");
    } catch (error) {
      setMessage("Error al enviar la solicitud ❌");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f2e1ff] p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-purple-800 mb-4 text-center">
          Recuperar contraseña
        </h2>
        <p className="text-purple-600 text-sm text-center mb-6">
          Ingresa tu correo electrónico registrado y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <input
            type="email"
            placeholder="tu.email@sena.edu.co"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
              loading ? "bg-purple-400" : "bg-purple-700 hover:bg-purple-800"
            }`}
          >
            {loading ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-purple-700">{message}</p>
        )}
      </div>
    </div>
  );
}
