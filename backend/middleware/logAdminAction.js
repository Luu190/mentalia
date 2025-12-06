// middleware/logAdminAction.js
import AdminLog from "../models/AdminLog.js";

const actionDictionary = [
  { match: "/alerts", text: "Consultó las alertas" },
  { match: "/alerts/today", text: "Consultó las alertas de hoy" },
  { match: "/alerts/pending", text: "Revisó alertas pendientes" },
  { match: "/phrases", text: "Consultó frases de riesgo" },
  { match: "/phrases/add", text: "Agregó una frase de riesgo" },
  { match: "/phrases/update", text: "Editó una frase de riesgo" },
  { match: "/psychologist/stats", text: "Consultó estadísticas generales" },
  { match: "/psychologist/stats/dashboard", text: "Consultó estadísticas del panel" },
  { match: "/sessions/active", text: "Revisó sesiones activas" },
  { match: "/admin/logs", text: "Revisó el historial de actividad" },
];

function getReadableAction(url) {
  for (const item of actionDictionary) {
    if (url.includes(item.match)) return item.text;
  }
  return "Realizó una acción en el sistema";
}

export const logAdminAction = async (req, res, next) => {
  try {
    await AdminLog.create({
      adminId: req.user?.id,
      action: getReadableAction(req.originalUrl), // ⭐ Ahora es un texto amigable
      endpoint: req.originalUrl,                  // se guarda igual por auditoría
      method: req.method,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
  } catch (err) {
    console.error("❌ Error registrando AdminLog:", err);
  }

  next();
};
