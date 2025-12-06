import Alert from "../models/Alert.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import DailyAlertSummary from "../models/DailyAlertSummary.js";
import dayjs from "dayjs";
import AdminLog from "../models/AdminLog.js";

/* ============================
   📌 CREAR ALERTA (LLAMADO POR CHATBOT)
   ============================ */
export const createAlert = async (data) => {
  try {

    /* ⭐ NUEVO ⭐
       Nos aseguramos de que la severidad **siempre exista**
       y se guarde en la alerta para que el frontend pueda filtrar.
    */
    const severityValue = data.severity || "medio";

    const alertData = {
      ...data,

      // ⭐ corregido: guardamos severity REAL
      severity: severityValue,

      // ⭐ CRÍTICA = severidad alto
      isCritical: severityValue === "alto",

      riskLevel: data.riskLevel || (severityValue === "alto" ? 5 : 2),
    };

    const alert = await Alert.create(alertData);

    if (alert.isCritical) {
      await notifyCriticalAlert(alert);
      await handleDailyCriticalSummary(alert);
    }

  } catch (err) {
    console.error("❌ Error creando alerta:", err);
  }
};

/* ============================
   📌 NOTIFICAR ALERTA CRÍTICA
   ============================ */
export const notifyCriticalAlert = async (alert) => {
  try {
    const admin = await User.findOne({ rol: "admin" });
    if (!admin) return;

    await sendEmail({
      to: admin.email,
      subject: "⚠ ALERTA CRÍTICA DETECTADA — MENTALIA",
      html: `
        <h2 style="color:#b30000;">⚠ ALERTA CRÍTICA DETECTADA</h2>
        <p><strong>Frase:</strong> ${alert.phrase}</p>
        <p><strong>Mensaje:</strong> ${alert.message}</p>
        <p><strong>Categoría:</strong> ${alert.category}</p>
        <p><strong>Severidad:</strong> ${alert.severity}</p>
        <p><strong>Sesión:</strong> ${alert.sessionId}</p>
      `
    });

    alert.notifiedAt = new Date();
    await alert.save();
  } catch (err) {
    console.log("❌ Error enviando correo:", err);
  }
};

/* ============================
   📌 CONSULTAR TODAS LAS ALERTAS
   ============================ */
export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ msg: "Error obteniendo alertas" });
  }
};

/* ============================
   📌 FILTRAR ALERTAS
   ============================ */
export const getFilteredAlerts = async (req, res) => {
  try {
    const { estado, severidad } = req.query;
    const filtro = {};

    if (estado) filtro.status = estado;
    if (severidad) filtro.severity = severidad;

    const alerts = await Alert.find(filtro).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ msg: "Error filtrando alertas" });
  }
};

/* ============================
   📌 ACTUALIZAR ALERTA (Marcar como atendida)
   ============================ */
export const updateAlertStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Alert.findByIdAndUpdate(
      id,
      { status, resolved: status === "atendida" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Alerta no encontrada" });
    }

    // RNF9
    await AdminLog.create({
      adminId: req.user.id,
      action: "ACTUALIZAR ESTADO DE ALERTA",
      endpoint: "/alerts/:id",
      details: { id, newStatus: status },
      ip: req.ip
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Error actualizando alerta" });
  }
};

/* ============================
   📌 RF24 (Acumulación diaria)
   ============================ */
const handleDailyCriticalSummary = async (alert) => {
  try {
    const today = dayjs().format("YYYY-MM-DD");

    let summary = await DailyAlertSummary.findOne({ date: today });
    if (!summary) {
      summary = await DailyAlertSummary.create({
        date: today,
        criticalCount: 0,
        notifiedToPsychologist: false,
      });
    }

    summary.criticalCount++;

    if (summary.criticalCount >= 3 && !summary.notifiedToPsychologist) {
      const admin = await User.findOne({ rol: "admin" });

      if (admin) {
        await sendEmail({
          to: admin.email,
          subject: "🚨 ACUMULACIÓN DE ALERTAS CRÍTICAS — MENTALIA",
          html: `
            <h2 style="color:#b30000;">🚨 ALERTAS CRÍTICAS ACUMULADAS</h2>
            <p>Hoy se han generado <strong>${summary.criticalCount}</strong> alertas críticas.</p>
          `
        });

        summary.notifiedToPsychologist = true;
      }
    }

    await summary.save();
  } catch (err) {
    console.log("❌ Error en RF24:", err);
  }
};

/* ============================
   📌 Método cron RF24
   ============================ */
export const checkDailyCriticalAlerts = async () => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const count = await Alert.countDocuments({
      severity: "alto",
      createdAt: { $gte: start },
    });

    if (count >= 3) {
      const admin = await User.findOne({ rol: "admin" });

      if (admin) {
        await sendEmail({
          to: admin.email,
          subject: "🚨 ACUMULACIÓN DE ALERTAS — MENTALIA",
          html: `
            <h2 style="color:#b30000;">🚨 ALERTAS CRÍTICAS ACUMULADAS</h2>
            <p>Hoy se han generado <strong>${count}</strong> alertas críticas.</p>
          `
        });
      }
    }
  } catch (err) {
    console.log("❌ Error verificando acumulación:", err);
  }
};
