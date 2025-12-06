"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import LayoutAdmin from "./LayoutAdmin";
import AlertaCritica from "./Alertas/AlertaCritica";
import ExportacionesView from "./ExportacionesView";

import DashboardTabs from "./DashboardTabs";
import EstadisticasCards from "./EstadisticasCards";
import GraficaUsoChatbot from "./GraficaUsoChatbot";
import GraficaEmociones from "./GraficaEmociones";

import AlertasView from "./Alertas/AlertasView";
import FrasesRiesgoView from "./Frases/FrasesRiesgoView";
import SettingsView from "../vistas-reutilizables/SettingsView";
import GraficaAlertasCriticas from "./GraficaAlertasCriticas";
import ContenidoView from "./Contenido/ContenidoView";

// ⭐ NUEVO — para RNF9
import LogsView from "./logs/LogsView";

// ⭐ NUEVO — RF21
import BusquedaView from "./Busqueda/BusquedaView";

export default function PanelPsicologa() {
  const router = useRouter();
  const [storedUser, setStoredUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [pendingAlerts, setPendingAlerts] = useState(0);

  // ============================
  //  ⚠️ Cargar usuario autenticado
  // ============================
  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(rawUser);

      if (user?.rol !== "admin") {
        router.replace("/dashboard");
        return;
      }

      setStoredUser(user);
    } catch {
      router.replace("/login");
    }
  }, []);

  // ============================
  //  🔥 Cargar alertas pendientes
  // ============================
  useEffect(() => {
    async function cargarPendientes() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/psychologist/alerts/pending/count`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!res.ok) return;

        const data = await res.json();
        setPendingAlerts(data.count || 0);
      } catch (e) {
        console.error("Error cargando alerta crítica:", e);
      }
    }

    cargarPendientes();
  }, []);

  if (!storedUser) return null;

  return (
    <LayoutAdmin
      user={storedUser}
      onChangeView={(view) => setActiveTab(view)}
      activeView={activeTab}
    >
      {/* ----- AJUSTES ----- */}
      {activeTab === "Ajustes" ? (
        <div className="px-6 mt-6">
          <SettingsView />
        </div>
      ) : (
        <>
          {/* ----- ALERTA CRÍTICA (solo Dashboard) ----- */}
          {activeTab === "Dashboard" && pendingAlerts > 0 && (
            <div className="px-6 mt-4">
              <AlertaCritica
                cantidad={pendingAlerts}
                onVerAlertas={() => setActiveTab("Alertas")}
              />
            </div>
          )}

          {/* ----- TÍTULO ----- */}
          <div className="px-6 mt-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              Panel de Psicóloga Institucional
            </h1>
            <p className="text-gray-500">
              Monitoreo y gestión de la plataforma MENTALIA
            </p>
          </div>

          {/* ----- TABS ----- */}
          <div className="mt-6 px-6">
            <DashboardTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              includeSettings={true}
            />
          </div>

          {/* ----- CONTENIDO PRINCIPAL ----- */}
          <main className="px-6 mt-4 pb-10">
            {/* DASHBOARD */}
            {activeTab === "Dashboard" && (
              <>
                <EstadisticasCards />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <GraficaUsoChatbot />
                  <GraficaEmociones />
                  <GraficaAlertasCriticas />
                </div>
              </>
            )}

            {/* ALERTAS */}
            {activeTab === "Alertas" && (
              <div className="mt-2">
                <AlertasView />
              </div>
            )}

            {/* FRASES DE RIESGO */}
            {activeTab === "Frases de Riesgo" && (
              <div className="mt-2">
                <FrasesRiesgoView />
              </div>
            )}

            {/* CONTENIDO */}
            {activeTab === "Contenido" && (
              <div className="mt-2">
                <ContenidoView />
              </div>
            )}

            {/* EXPORTACIONES */}
            {activeTab === "Exportaciones" && <ExportacionesView />}

            {/* ⭐ LOGS — RNF9 */}
            {activeTab === "Logs" && (
              <div className="mt-2">
                <LogsView />
              </div>
            )}

            {/* ⭐ NUEVO — RF21 */}
            {activeTab === "Busqueda" && (
              <div className="mt-2">
                <BusquedaView />
              </div>
            )}
          </main>
        </>
      )}
    </LayoutAdmin>
  );
}
