"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function EvolucionEmocionalChart({ labels, values }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Bienestar",
        data: values,
        borderColor: "#a855f7",
        backgroundColor: "#a855f7",
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 7,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Bienestar: ${context.raw}/5`,
          title: (context) => `Día: ${context[0].label}`,
        },
        padding: 12,
        backgroundColor: "rgba(168, 85, 247, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1 },
        grid: { color: "#e5e7eb" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="h-52">
      <Line data={data} options={options} />
    </div>
  );
}
