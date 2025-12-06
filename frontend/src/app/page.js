"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Shield, User, Heart, Phone } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#A259FF] to-[#3A86FF] relative font-sans">
      
      {/* Encabezado superior */}
      <div className="absolute top-8 w-full flex justify-center">
        <div className="bg-white/25 text-xl px-8 py-3 rounded-full text-white font-semibold shadow-md tracking-wide">
          SENA - Servicio Nacional de Aprendizaje
        </div>
      </div>

      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between px-8 lg:px-16 mt-20">
        
        {/* Texto principal */}
        <div className="text-white max-w-xl">
          <h1 className="text-5xl font-extrabold mb-2 flex items-center gap-3">
            <Image 
              src="/logomentalia.png.png"
              alt="Logo Mentalia"
              width={50}
              height={50}
              className="w-10 h-10 object-contain"
            />
            <span className="tracking-tight">MENTALIA</span>
          </h1>

          <p className="text-lg mb-8 font-medium opacity-90">Plataforma de Apoyo Emocional</p>

          <h2 className="text-2xl font-bold mb-4 leading-snug">
            Bienvenido a la plataforma de apoyo emocional del SENA
          </h2>

          <p className="text-base mb-8 leading-relaxed text-white/90 max-w-md">
            MENTALIA es tu espacio seguro para el bienestar emocional. 
            Te acompañamos 24/7 con herramientas tecnológicas diseñadas con 
            responsabilidad y empatía.
          </p>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-10 text-sm font-medium mb-12">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-300" /> Disponible 24/7
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-300" /> Confidencial y seguro
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-green-300" /> Apoyo profesional
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-300" /> Sin prejuicios
            </div>
          </div>

          {/* 🔹 Botones de acción */}
          <div className="flex gap-4">
            <Link href="/login">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full font-semibold hover:opacity-90 transition shadow-lg">
                Iniciar Sesión
              </button>
            </Link>

            <Link href="/panel-usuario-anonimo">
              <button className="px-8 py-3 border border-white/40 text-white rounded-full font-semibold hover:bg-white/10 transition shadow-md">
                Usar de forma anónima
              </button>
            </Link>
          </div>
        </div>

        {/* Tarjeta con imagen */}
        <div className="bg-white rounded-2xl overflow-hidden mt-12 md:mt-0 md:ml-16 shadow-2xl max-w-lg w-full">
          <Image
            src="/foto-panel-principal.jpg"
            alt="Apoyo emocional"
            width={700}
            height={450}
            className="object-cover w-full h-80 md:h-96"
          />
          <div className="p-8">
            <h3 className="font-bold text-gray-900 text-xl mb-3">
              Tu bienestar es nuestra prioridad
            </h3>
            <p className="text-gray-600 text-base">
              Encuentra el apoyo que necesitas en un ambiente seguro, confidencial y gratuito.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full border-t border-white/20 py-4">
        <div className="flex justify-center items-center gap-10 text-sm text-white/80">
          <a href="#" className="hover:underline">Política de privacidad</a>
          <a href="#" className="hover:underline">Líneas de ayuda inmediatas</a>
          <span className="flex items-center gap-2 text-red-300 font-medium">
            <Phone className="w-4 h-4" /> Línea Nacional: 106
          </span>
        </div>
      </footer>
    </main>
  );
}