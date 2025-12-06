"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function GraficaUsoChatbot() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/api/psychologist/stats/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error stats:", err));
  }, []);

  if (!stats)
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <p className="text-gray-500">Cargando uso…</p>
      </div>
    );

  const data = {
    labels: stats.months,
    datasets: [
      {
        label: "Uso",
        data: stats.chatbotUsage,
        borderColor: "#A855F7",
        backgroundColor: "rgba(168, 85, 247, 0.08)", // MÁS SUAVE COMO FIGMA
        tension: 0.55, // LÍNEA MÁS SUAVE
        borderWidth: 2, // MÁS DELGADA (FIGMA STYLE)
        pointRadius: 4, // PUNTO PEQUEÑO
        pointHoverRadius: 6,
        pointBackgroundColor: "#A855F7",
        pointBorderColor: "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#A855F7",
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280", font: { size: 13 } },
      },
      y: {
        ticks: { color: "#6b7280", font: { size: 12 } },
        grid: {
          color: "rgba(0,0,0,0.05)", // MÁS SUAVE COMO FIGMA
          drawBorder: false,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-center font-semibold text-gray-700 mb-4">
        Uso Total del Chatbot
      </h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
