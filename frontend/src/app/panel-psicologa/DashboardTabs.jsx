"use client";

export default function DashboardTabs({ activeTab, setActiveTab }) {
  const tabs = [
    "Dashboard",
    "Alertas",
    "Frases de Riesgo",
    "Contenido",
    "Exportaciones",
    "Logs" // ⭐ NUEVO — para RNF9
  ];

  return (
    <div className="flex gap-8 border-b border-gray-200 pb-2 text-sm font-medium">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setActiveTab(t)}
          className={
            activeTab === t
              ? "text-purple-600 border-b-2 border-purple-600 pb-2"
              : "text-gray-500 hover:text-gray-700 pb-2"
          }
        >
          {t}
        </button>
      ))}
    </div>
  );
}
