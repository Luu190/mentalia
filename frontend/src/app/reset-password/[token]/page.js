"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; // 👁️ iconos modernos

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Validación dinámica mientras escribe
  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setError("❌ Las contraseñas no coinciden");
    } else if (password && password.length < 8) {
      setError("❌ La contraseña debe tener al menos 8 caracteres");
    } else {
      setError("");
    }
  }, [password, confirmPassword]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (error) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`http://localhost:4000/api/auth/reset-password/${token}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ newPassword: password }),
});




      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Contraseña actualizada correctamente");
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setMessage("❌ " + (data.msg || "Error al actualizar contraseña"));
      }
    } catch (err) {
      setMessage("❌ Error de conexión con el servidor");
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
          {/* Campo contraseña */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${
                error && password.length < 8
                  ? "border-red-400 focus:ring-red-400"
                  : "border-purple-300 focus:ring-purple-500"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-purple-600 hover:text-purple-800"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirmar contraseña */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${
                error === "❌ Las contraseñas no coinciden"
                  ? "border-red-400 focus:ring-red-400"
                  : "border-purple-300 focus:ring-purple-500"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-purple-600 hover:text-purple-800"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Mensaje de error */}
          {error && (
            <p className="text-red-500 text-sm text-center mt-1">{error}</p>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading || error}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
              loading || error
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-800"
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
