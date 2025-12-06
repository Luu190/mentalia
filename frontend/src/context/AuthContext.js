"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();

  // 🧠 Cargar sesión almacenada al abrir la app
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 🕐 Temporizador de inactividad (30 min)
  useEffect(() => {
    let inactivityTimer;

    function resetTimer() {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        handleLogout(true); // logout automático
      }, 30 * 60 * 1000); // 30 minutos
    }

    ["mousemove", "keydown", "click"].forEach((e) =>
      window.addEventListener(e, resetTimer)
    );

    resetTimer();
    return () => ["mousemove", "keydown", "click"].forEach((e) =>
      window.removeEventListener(e, resetTimer)
    );
  }, [token]);

  // 🚪 Cerrar sesión
  const handleLogout = async (auto = false) => {
    try {
      if (token) {
        await fetch("http://localhost:4000/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include"   // ⭐ NECESARIO PARA RNF8
        });
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);

    if (auto) {
      alert("⚠️ Sesión cerrada automáticamente por inactividad.");
    }

    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
