"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function GraficaEvolucionAlertas() {
  const data = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Alertas Críticas",
        data: [2, 4, 3, 6, 5, 8, 4],
        borderColor: "#ef4444",
        backgroundColor: "#fecaca",
        tension: 0.4,
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-700 mb-4">
        Evolución de Alertas Críticas
      </h3>
      <Line data={data} height={120} />
    </div>
  );
}
