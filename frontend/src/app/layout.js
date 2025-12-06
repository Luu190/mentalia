import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "../context/AuthContext";

// ⭐ IMPORTAR ACCESIBILIDAD
import { AccesibilidadProvider } from "../context/AccesibilidadContext";
import AccesibilidadPanel from "../components/AccesibilidadPanel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mentalia Chat",
  description: "Sistema de bienestar emocional",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 🌟 PROVIDERS GLOBALES */}
        <AuthProvider>
          <AccesibilidadProvider>
            {/* 🌟 PANEL FLOTANTE DE ACCESIBILIDAD */}
            <AccesibilidadPanel />

            {children}
          </AccesibilidadProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
