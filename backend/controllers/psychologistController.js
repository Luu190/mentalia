// backend/controllers/psychologistController.js
import Alert from "../models/Alert.js";
import Conversation from "../models/Conversation.js";
import CrisisPhrase from "../models/CrisisPhrase.js";
import AdminLog from "../models/AdminLog.js";

// Función helper para que el log NUNCA rompa el endpoint
async function safeAdminLog(payload) {
  try {
    await AdminLog.create(payload);
  } catch (err) {
    console.error("❌ Error registrando AdminLog:", err);
  }
}

// 📌 Obtener TODAS las alertas críticas (RF16)
export async function getCriticalAlerts(req, res) {
  try {
    const alerts = await Alert.find({ isCritical: true })
      .populate("userId", "programa ficha")
      .sort({ createdAt: -1 });

    await safeAdminLog({
      adminId: req.user?.id,
      action: "VER ALERTAS CRÍTICAS",
      endpoint: "/alerts",
      ip: req.ip
    });

    res.json(alerts);
  } catch (err) {
    console.error("❌ Error obteniendo alertas críticas:", err);
    res.status(500).json({ msg: "Error obteniendo alertas críticas" });
  }
}

// 📌 Marcar alerta como atendida
export async function resolveAlert(req, res) {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ msg: "Alerta no existe" });

    alert.resolved = true;
    await alert.save();

    await safeAdminLog({
      adminId: req.user?.id,
      action: "ATENDER ALERTA",
      endpoint: "/alerts/:id/resolve",
      details: { alertId: req.params.id },
      ip: req.ip
    });

    res.json({ msg: "Alerta marcada como atendida" });
  } catch (err) {
    console.error("❌ Error actualizando alerta:", err);
    res.status(500).json({ msg: "Error actualizando alerta" });
  }
}

// 📌 Cargar conversación completa asociada a una alerta (FUNCIONAL ANÓNIMOS + REGISTRADOS)
export async function getConversationByAlert(req, res) {
  try {
    const alert = await Alert.findById(req.params.alertId);
    if (!alert) return res.status(404).json({ msg: "Alerta no hallada" });

    // Buscar primero en Conversation (usuarios registrados)
    let convo = await Conversation.findById(alert.conversationId);

    // 🔥 Si NO está en Conversation, buscar en ChatSession (anónimos)
    if (!convo) {
      const ChatSession = (await import("../models/ChatSession.js")).default;
      convo = await ChatSession.findById(alert.conversationId);
    }

    await safeAdminLog({
      adminId: req.user?.id,
      action: "VER CONVERSACIÓN DE ALERTA",
      endpoint: "/alerts/:id/conversation",
      details: { alertId: req.params.alertId },
      ip: req.ip
    });

    // Si no existe en ningún modelo, devolver vacío
    if (!convo) {
      return res.json({ messages: [] });
    }

    res.json(convo);
  } catch (err) {
    console.error("❌ Error obteniendo conversación:", err);
    res.status(500).json({ msg: "Error obteniendo conversación" });
  }
}

// 📌 Búsqueda de conversaciones (RF21)
export async function searchConversations(req, res) {
  try {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ msg: "keyword requerido" });

    const conversations = await Conversation.find({
      "messages.text": { $regex: keyword, $options: "i" }
    });

    await safeAdminLog({
      adminId: req.user?.id,
      action: "BUSCAR CONVERSACIONES",
      endpoint: "/conversations/search",
      details: { keyword },
      ip: req.ip
    });

    res.json(conversations);
  } catch (err) {
    console.error("❌ Error buscando conversaciones:", err);
    res.status(500).json({ msg: "Error buscando conversaciones" });
  }
}

// ⭐⭐⭐ Cantidad de alertas críticas pendientes — Dashboard
export async function getPendingCriticalCount(req, res) {
  try {
    const count = await Alert.countDocuments({
      isCritical: true,
      resolved: false
    });

    await safeAdminLog({
      adminId: req.user?.id,
      action: "VER CONTADOR DE ALERTAS",
      endpoint: "/alerts/pending/count",
      ip: req.ip
    });

    res.json({ count });
  } catch (err) {
    console.error("❌ Error obteniendo cantidad de alertas:", err);
    res.status(500).json({ msg: "Error obteniendo cantidad de alertas" });
  }
}

// 📌 NUEVO — Alertas críticas generadas HOY (para dashboard)
export async function getTodayAlerts(req, res) {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const count = await Alert.countDocuments({
      isCritical: true,
      createdAt: { $gte: start }
    });

    await safeAdminLog({
      adminId: req.user?.id,
      action: "VER ALERTAS HOY",
      endpoint: "/alerts/today",
      ip: req.ip
    });

    res.json({ count });
  } catch (err) {
    console.error("❌ Error obteniendo alertas de hoy:", err);
    res.status(500).json({ msg: "Error obteniendo alertas de hoy" });
  }
}

// 📌 NUEVO — Sesiones activas del chatbot (para dashboard)
export async function getActiveChatbotSessions(req, res) {
  try {
    const count = await Conversation.countDocuments({
      endedAt: null
    });

    await safeAdminLog({
      adminId: req.user?.id,
      action: "VER SESIONES ACTIVAS",
      endpoint: "/sessions/active",
      ip: req.ip
    });

    res.json({ count });
  } catch (err) {
    console.error("❌ Error obteniendo sesiones activas:", err);
    res.status(500).json({ msg: "Error obteniendo sesiones activas" });
  }
}
