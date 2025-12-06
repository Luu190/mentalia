"use client";

import { FileDown, FileSpreadsheet, ShieldAlert } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ExportacionesView() {

  const descargarPDF = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/psychologist/stats/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error descargando PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "estadisticas.pdf";
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("❌ Error PDF:", err);
      alert("No se pudo descargar el PDF");
    }
  };

  const descargarExcel = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/psychologist/stats/excel`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error descargando Excel");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "estadisticas.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("❌ Error Excel:", err);
      alert("No se pudo descargar el archivo Excel");
    }
  };

  return (
    <div className="w-full px-2 md:px-6 pb-10 mt-4">
      <div className="bg-white shadow-lg border border-gray-200 rounded-2xl p-6 md:p-8">

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Exportación de Datos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* PDF */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileDown className="w-5 h-5 text-gray-700" />
              <span className="font-semibold text-gray-800">Reporte PDF</span>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              Genera un reporte completo en PDF con estadísticas agregadas sin información personal.
            </p>

            <button
              onClick={descargarPDF}
              className="w-full lg:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              Descargar PDF
            </button>
          </div>

          {/* EXCEL */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileSpreadsheet className="w-5 h-5 text-gray-700" />
              <span className="font-semibold text-gray-800">Datos Excel</span>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              Exporta datos estadísticos en formato Excel para análisis detallado.
            </p>

            <button
              onClick={descargarExcel}
              className="w-full lg:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Descargar Excel
            </button>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Datos Incluidos en las Exportaciones
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 text-md mb-2">
                Métricas Generales:
              </h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Número total de usuarios atendidos</li>
                <li>• Frecuencia de uso del chatbot</li>
                <li>• Tiempo promedio de sesiones</li>
                <li>• Usuarios registrados vs. anónimos</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 text-md mb-2">
                Análisis Emocional:
              </h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Tipos de emociones detectadas</li>
                <li>• Frecuencia de emociones por categoría</li>
                <li>• Número de alertas de riesgo generadas</li>
                <li>• Tendencias temporales</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-blue-700 mt-1" />
            <p className="text-sm text-blue-900 leading-tight">
              <span className="font-semibold">Privacidad garantizada:</span>{" "}
              Las exportaciones no contienen datos personales sensibles.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
