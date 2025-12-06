"use client";

export default function TarjetaAlerta({ alerta, onAtender, onDescartar }) {
  // ⭐ Normalizamos el tipo visual según prioridad real
  let tipoVisual = alerta.tipo;

  // Si no es crítica y prioridad es "alto", se fuerza como ALTA PRIORIDAD
  if (alerta.tipo !== "CRÍTICA" && alerta.prioridad === "alto") {
    tipoVisual = "ALTA PRIORIDAD";
  }

  // Estilos ampliados con NORMAL incluido
  const estilos = {
    CRÍTICA: {
      borde: "border-l-4 border-[#FF4D4D]",
      badgeBg: "bg-[#FFEAEA]",
      badgeText: "text-[#C53030]",
    },
    "ALTA PRIORIDAD": {
      borde: "border-l-4 border-[#FFAA33]",
      badgeBg: "bg-[#FFF3E0]",
      badgeText: "text-[#B46900]",
    },
    NORMAL: {
      borde: "border-l-4 border-[#CFCFCF]",
      badgeBg: "bg-[#F5F5F5]",
      badgeText: "text-[#555555]",
    },
  };

  // Selección de estilo final
  const s = estilos[tipoVisual] || {};

  return (
    <div
      className={`w-full bg-white rounded-lg shadow-sm border border-gray-200 px-5 py-4 ${
        s.borde || ""
      }`}
    >
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${s.badgeBg} ${s.badgeText}`}
          >
            {tipoVisual}
          </span>

          <span className="text-gray-600 text-xs md:text-sm">
            {alerta.fecha}
          </span>

          {alerta.estado === "atendida" && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#DFF6E3] text-[#2F8F3A]">
              ATENDIDA
            </span>
          )}
        </div>

        {alerta.estado !== "atendida" && (
          <div className="flex gap-3">
            {/* BOTÓN ATENDER (CORPORATIVO VERDE) */}
            <button
              onClick={onAtender}
              className="
                px-4 py-2
                bg-[#009C74]
                hover:bg-[#00845F]
                text-white
                rounded-lg
                text-sm font-medium
                shadow-sm
                transition
              "
            >
              Atender
            </button>

            {/* BOTÓN DESCARTAR */}
            <button
              onClick={onDescartar}
              className="
                px-4 py-2
                bg-[#F7F7FB]
                hover:bg-[#EDEDF3]
                text-gray-700
                border border-gray-300
                rounded-lg
                text-sm font-medium
                shadow-sm
                transition
              "
            >
              Descartar
            </button>
          </div>
        )}
      </div>

      <p className="mt-2 text-gray-800 text-sm font-medium">
        {alerta.descripcion}
      </p>

      <p className="text-gray-400 text-xs mt-1">
        ID de sesión: {alerta.sesion}
      </p>
    </div>
  );
}
