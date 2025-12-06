// backend/controllers/statsController.js
import Conversation from "../models/Conversation.js";
import Alert from "../models/Alert.js";
import JournalEntry from "../models/JournalEntry.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import AdminLog from "../models/AdminLog.js";

// ⭐ IMPORTAMOS NORMALIZADOR SIN TOCAR NADA MÁS
import { normalizeEmotion } from "../utils/emotionAnalyzer.js";

/* ----------------- Helpers comunes ----------------- */

const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function aggregateStats({
  usersCount,
  chatbotUsage,
  emotions,
  alertsCritical,
  alertsModerate,
  avgSessionTime,
  registeredUsers,
  anonymousUsers
}) {
  return {
    usersCount,
    chatbotUsage,
    emotions,
    alertsCritical,
    alertsModerate,
    avgSessionTime,
    registeredUsers,
    anonymousUsers
  };
}

async function safeAdminLog(payload) {
  try {
    await AdminLog.create(payload);
  } catch (err) {
    console.error("❌ Error registrando AdminLog (stats):", err);
  }
}

/* ----------------- Cálculo general de stats (totales) ----------------- */

async function calculateStats() {
  const chatbotUsage = await Conversation.countDocuments();
  const alertsCritical = await Alert.countDocuments({ isCritical: true });
  const alertsModerate = await Alert.countDocuments({ isCritical: false });
  const usersCount = await JournalEntry.distinct("userId").then(arr => arr.length);

  const emotions = await JournalEntry.aggregate([
    { $match: { deleted: false } },
    { $group: { _id: "$emotion", total: { $sum: 1 } } },
    { $sort: { total: -1 } }
  ]);

  const durationsAgg = await Conversation.aggregate([
    { $match: { startedAt: { $ne: null }, endedAt: { $ne: null } } },
    {
      $project: {
        duration: {
          $divide: [{ $subtract: ["$endedAt", "$startedAt"] }, 1000]
        }
      }
    },
    { $group: { _id: null, avgDuration: { $avg: "$duration" } } }
  ]);

  const avgSessionTime = durationsAgg[0]?.avgDuration || 0;

  const registeredUsers = await Conversation.countDocuments({ type: "registrado" });
  const anonymousUsers = await Conversation.countDocuments({ type: "anonimo" });

  return aggregateStats({
    usersCount,
    chatbotUsage,
    emotions,
    alertsCritical,
    alertsModerate,
    avgSessionTime,
    registeredUsers,
    anonymousUsers
  });
}

/* ----------------- RF18: /stats (totales + PDF + Excel) ----------------- */

export async function getStats(req, res) {
  try {
    const stats = await calculateStats();

    await safeAdminLog({
      adminId: req.user?.id,
      action: "CONSULTAR ESTADÍSTICAS",
      endpoint: "/stats",
      ip: req.ip
    });

    res.json(stats);
  } catch (err) {
    console.error("❌ Error obteniendo estadísticas:", err);
    res.status(500).json({ msg: "Error obteniendo estadísticas" });
  }
}

/* ----------- PDF PROFESIONAL ----------- */
export async function exportPDF(req, res) {
  try {
    const stats = await calculateStats();

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=estadisticas.pdf");
    doc.pipe(res);

    /* Título */
    doc.fontSize(22).text("Reporte de Estadísticas - MENTALIA", { underline: true });
    doc.moveDown(1.5);

    /* Sección: Métricas generales */
    doc.fontSize(16).text("1. Métricas Generales", { underline: true });
    doc.moveDown();

    doc.fontSize(12)
      .text(`• Usuarios atendidos: ${stats.usersCount}`)
      .text(`• Conversaciones totales: ${stats.chatbotUsage}`)
      .text(`• Alertas críticas: ${stats.alertsCritical}`)
      .text(`• Alertas moderadas: ${stats.alertsModerate}`)
      .text(`• Tiempo promedio de sesión: ${stats.avgSessionTime.toFixed(2)} s`)
      .text(`• Usuarios registrados: ${stats.registeredUsers}`)
      .text(`• Usuarios anónimos: ${stats.anonymousUsers}`);

    doc.moveDown(1.5);

    /* Sección emociones */
    doc.fontSize(16).text("2. Emociones Detectadas", { underline: true });
    doc.moveDown();

    if (stats.emotions.length === 0) {
      doc.text("No hay registros emocionales aún.");
    } else {
      stats.emotions.forEach(e => {
        doc.text(`• ${e._id}: ${e.total}`);
      });
    }

    doc.moveDown(1.5);

    /* Cierre */
    doc.fontSize(10).text("Reporte generado automáticamente por MENTALIA.", {
      align: "right",
      opacity: 0.7
    });

    doc.end();

    await safeAdminLog({
      adminId: req.user?.id,
      action: "EXPORTAR PDF",
      endpoint: "/stats/pdf",
      ip: req.ip
    });
  } catch (err) {
    console.error("❌ Error exportando PDF:", err);
    res.status(500).json({ msg: "Error exportando PDF" });
  }
}

/* ----------- EXCEL PROFESIONAL ----------- */
export async function exportExcel(req, res) {
  try {
    const stats = await calculateStats();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Estadísticas MENTALIA");

    /* Columnas */
    sheet.columns = [
      { header: "Categoría", key: "category", width: 35 },
      { header: "Descripción", key: "value", width: 30 }
    ];

    /* Sección métricas generales */
    sheet.addRow(["MÉTRICAS GENERALES", ""]);
    sheet.addRow(["Usuarios atendidos", stats.usersCount]);
    sheet.addRow(["Conversaciones totales", stats.chatbotUsage]);
    sheet.addRow(["Alertas críticas", stats.alertsCritical]);
    sheet.addRow(["Alertas moderadas", stats.alertsModerate]);
    sheet.addRow(["Tiempo promedio de sesión (s)", stats.avgSessionTime.toFixed(2)]);
    sheet.addRow(["Usuarios registrados", stats.registeredUsers]);
    sheet.addRow(["Usuarios anónimos", stats.anonymousUsers]);

    sheet.addRow([]);

    /* Sección emociones */
    sheet.addRow(["EMOCIONES DETECTADAS", ""]);
    stats.emotions.forEach(e => {
      sheet.addRow([e._id, e.total]);
    });

    /* Descarga */
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=estadisticas.xlsx");

    await workbook.xlsx.write(res);
    res.end();

    await safeAdminLog({
      adminId: req.user?.id,
      action: "EXPORTAR EXCEL",
      endpoint: "/stats/excel",
      ip: req.ip
    });
  } catch (err) {
    console.error("❌ Error exportando Excel:", err);
    res.status(500).json({ msg: "Error exportando Excel" });
  }
}

/* ----------------- /stats/dashboard (Opción B Combinada) ----------------- */
export async function getDashboardStats(req, res) {
  try {
    const now = new Date();
    const months = [];
    const chatbotUsage = [];
    const alertsCritical = [];
    const alertsModerate = [];

    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);

      months.push(MONTH_LABELS[d.getMonth()]);

      // ⭐ CONTAR MENSAJES DEL CHATBOT (uso real)
      const messagesCount = await Conversation.aggregate([
        { $match: { createdAt: { $gte: start, $lt: end } } },
        { $unwind: "$messages" },
        { $group: { _id: null, total: { $sum: 1 } } }
      ]);

      chatbotUsage.push(messagesCount[0]?.total || 0);

      alertsCritical.push(
        await Alert.countDocuments({ isCritical: true, createdAt: { $gte: start, $lt: end } })
      );

      alertsModerate.push(
        await Alert.countDocuments({ isCritical: false, createdAt: { $gte: start, $lt: end } })
      );
    }

    // ⭐⭐⭐ Emociones del diario
    const journalEmotions = await JournalEntry.aggregate([
      { $match: { deleted: false } },
      { $group: { _id: "$emotion", total: { $sum: 1 } } }
    ]);

    // ⭐⭐⭐ Emociones en conversaciones registradas
    const convoEmotions = await Conversation.aggregate([
      { $unwind: "$messages" },
      { $match: { "messages.emotion": { $ne: null } } },
      { $group: { _id: "$messages.emotion", total: { $sum: 1 } } }
    ]);

    // ⭐⭐⭐ Emociones anónimas
    const ChatSession = (await import("../models/ChatSession.js")).default;

    const anonEmotions = await ChatSession.aggregate([
      { $unwind: "$messages" },
      { $match: { "messages.emotion": { $ne: null } } },
      { $group: { _id: "$messages.emotion", total: { $sum: 1 } } }
    ]);

    // ⭐⭐⭐ Combinar todo en un único mapa
    const emotionMap = new Map();

    const addToMap = (list) => {
      for (const e of list) {
        if (!emotionMap.has(e._id)) emotionMap.set(e._id, e.total);
        else emotionMap.set(e._id, emotionMap.get(e._id) + e.total);
      }
    };

    addToMap(journalEmotions);
    addToMap(convoEmotions);
    addToMap(anonEmotions);

    /* ======================================================
       ⭐ NORMALIZACIÓN DE EMOCIONES ANTES DE ENVIAR AL FRONT
    ====================================================== */
    const normalizedMap = new Map();

    for (const [rawEmotion, total] of emotionMap.entries()) {
      const emo = normalizeEmotion(rawEmotion);

      if (!normalizedMap.has(emo)) normalizedMap.set(emo, total);
      else normalizedMap.set(emo, normalizedMap.get(emo) + total);
    }

    /* ⭐⭐⭐ Convertir normalizedMap a array ordenado y limpio */
    const emotionsCombined = [...normalizedMap.entries()]
      .map(([emotion, total]) => ({
        emotion: emotion && emotion !== "" ? emotion : "desconocida",
        total
      }))
      .filter(e => e.total > 0)
      .sort((a, b) => b.total - a.total);

    res.json({
      months,
      chatbotUsage,
      alerts: { critical: alertsCritical, moderate: alertsModerate },
      emotions: emotionsCombined
    });

  } catch (err) {
    console.error("❌ Error obteniendo stats dashboard:", err);
    res.status(500).json({ msg: "Error obteniendo estadísticas del dashboard" });
  }
}
