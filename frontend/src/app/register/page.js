"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowLeft, Eye } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // <-- Necesario para redirección

/* 🔹 Estilos */
const label =
  "block text-sm font-semibold text-purple-700 mb-1 tracking-wide";
const input =
  "w-full border border-purple-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm";

export default function Register() {
  const router = useRouter(); // <-- Inicializar router

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    age: "",
    gender: "",
    program: "",
    ficha: "",
    email: "",
    phone: "",
    password: "",
    consentimiento: false,     // ⭐ AGREGADO PARA RNF10
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  // 📌 Registro
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.consentimiento) {
      alert("⚠️ Debes aceptar el consentimiento informado para continuar.");
      return;
    }

    const body = {
      nombre: formData.fullName,
      identificacion: formData.idNumber,
      edad: formData.age,
      genero: formData.gender,
      programa: formData.program,
      ficha: formData.ficha,
      telefono: formData.phone,
      email: formData.email,
      password: formData.password,

      consentimientoDatos: true,  // ⭐ SE ENVÍA AL BACKEND (RNF10)
    };

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Usuario registrado con éxito");
        router.push("/login"); // <-- Redirección restaurada
        return;
      } else {
        alert("❌ Error: " + (data.msg || data.error));
      }
    } catch (err) {
      console.error("Error en el registro:", err);
      alert("❌ Error inesperado.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f3e8ff] font-sans p-6 relative">
      
      {/* Botón volver */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-purple-700 hover:underline cursor-pointer">
        <ArrowLeft className="w-4 h-4" />
        <Link href="/" className="text-sm font-medium">
          Volver
        </Link>
      </div>

      {/* Logo superior derecho */}
      <div className="absolute top-6 right-8 flex flex-col items-center text-purple-700">
        <div className="flex items-center">
          <Heart className="w-6 h-6 mr-2" />
          <span className="text-xl font-medium tracking-wide">MENTALIA</span>
        </div>
        <span className="text-xs text-purple-500 -mt-1">SENA</span>
      </div>

      <div className="flex flex-col md:flex-row max-w-5xl mx-auto w-full gap-10 items-center justify-center">
        
        {/* Panel izquierdo */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full md:w-[60%] flex flex-col mx-auto">
          <div className="h-[280px] w-full overflow-hidden">
            <Image
              src="/icono-registrarse.jpg"
              alt="Bienestar"
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 flex flex-col justify-start flex-grow bg-white">
            <h2 className="text-lg font-semibold text-purple-700 mb-2">
              Tecnología al servicio de tu bienestar
            </h2>
            <p className="text-sm text-purple-500 leading-relaxed">
              Únete a nuestra comunidad y accede a herramientas personalizadas
              para tu crecimiento emocional.
            </p>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-full md:w-[60%]">
          <h2 className="text-2xl font-semibold text-center text-purple-700 mb-1">
            Crear Cuenta
          </h2>
          <p className="text-sm text-center text-purple-500 mb-8">
            Completa tus datos para comenzar tu journey de bienestar
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

              <div>
                <label className={label}>Nombre Completo *</label>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Tu nombre completo"
                  className={input}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className={label}>Identificación *</label>
                <input
                  name="idNumber"
                  type="text"
                  placeholder="Número de documento"
                  className={input}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className={label}>Edad *</label>
                <input
                  name="age"
                  type="number"
                  placeholder="Ingresa tu edad"
                  className={input}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className={label}>Género *</label>
                <select
                  name="gender"
                  className={input}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona tu género</option>
                  <option value="femenino">Femenino</option>
                  <option value="masculino">Masculino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={label}>Programa de Formación *</label>
                <select
                  name="program"
                  className={input}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona tu programa</option>
                  <option value="Análisis y Desarrollo de Software">
                    Análisis y Desarrollo de Software
                  </option>
                  <option value="Producción de Multimedia">
                    Producción de Multimedia
                  </option>
                  <option value="Gestión de Redes de Datos">
                    Gestión de Redes de Datos
                  </option>
                  <option value="Contabilidad y Finanzas">
                    Contabilidad y Finanzas
                  </option>
                  <option value="Gestión del Talento Humano">
                    Gestión del Talento Humano
                  </option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className={label}>Número de Ficha *</label>
                <input
                  name="ficha"
                  type="text"
                  placeholder="Número de ficha"
                  className={input}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className={label}>Teléfono *</label>
                <input
                  name="phone"
                  type="text"
                  placeholder="Número de teléfono"
                  className={input}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className={label}>Correo Electrónico *</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Ingresa tu email"
                  className={input}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-2 relative">
                <label className={label}>Contraseña *</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    className={`${input} pr-10`}
                    onChange={handleChange}
                    required
                  />
                  <Eye
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 w-5 h-5 text-gray-500 cursor-pointer"
                  />
                </div>
              </div>

            </div>

            {/* ⭐ AGREGADO PARA RNF10 */}
            <div className="flex items-start gap-3 text-xs text-gray-600 mt-2">
              <input
                type="checkbox"
                name="consentimiento"
                checked={formData.consentimiento}
                onChange={handleChange}
                className="mt-1 w-4 h-4"
                required
              />
              <p>
                Acepto el{" "}
                <Link
                  href="/politicas/consentimiento"
                  target="_blank"
                  className="text-purple-700 underline"
                >
                  consentimiento informado para el tratamiento de datos
                </Link>
                .
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              Crear Cuenta
            </button>
          </form>

          <p className="text-sm text-center text-purple-600 mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-purple-800 font-medium hover:underline"
            >
              Iniciar sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
