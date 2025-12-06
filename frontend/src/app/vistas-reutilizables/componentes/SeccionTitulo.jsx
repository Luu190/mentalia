"use client";

export default function SeccionTitulo({ titulo, subtitulo }) {
  return (
    <div className="mb-6">
      {/* Título */}
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
        {titulo}

        {/* Línea suave decorativa */}
        <span className="flex-1 h-[2px] bg-gradient-to-r from-[#e9d9ff] to-transparent"></span>
      </h2>

      {/* Subtítulo opcional */}
      {subtitulo && (
        <p className="text-sm text-gray-500 mt-1">
          {subtitulo}
        </p>
      )}
    </div>
  );
}


