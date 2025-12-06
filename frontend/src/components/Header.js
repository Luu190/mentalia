"use client";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, handleLogout } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 bg-purple-700 text-white">
      <h1>Bienvenida, {user?.nombre || "Usuario"}</h1>
      <button
        onClick={() => handleLogout(false)}
        className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-100 transition-all"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
