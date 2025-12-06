"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const { token } = useParams(); // 👈 obtiene el token de la URL
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("❌ Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Contraseña actualizada correctamente");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setMessage("❌ " + (data.msg || "Error al actualizar contraseña"));
      }
    } catch (err) {
      setMessage("❌ Error de conexión con el servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2e1ff] p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-purple-800 mb-4 text-center">
          Restablecer contraseña
        </h2>
        <p className="text-purple-600 text-sm text-center mb-6">
          Ingresa tu nueva contraseña para continuar.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Actualizando..." : "Restablecer contraseña"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-purple-700">{message}</p>
        )}
      </div>
    </div>
  );
}
