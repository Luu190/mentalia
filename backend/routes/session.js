// backend/routes/session.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Session from "../models/Session.js";
import { endAnonSession } from "../controllers/sessionController.js";
import AdminLog from "../models/AdminLog.js";

const router = express.Router();

/* ------------------------------------------------------------------
   🔥 Función auxiliar — Solo registra log si el usuario es ADMIN
   ------------------------------------------------------------------ */
async function logIfAdmin(req, action, details = {}) {
  try {
    if (!req.user || req.user.rol !== "admin") return;
    await AdminLog.create({
      adminId: req.user.id,
      action,
      endpoint: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.headers["user-agent"] || "",
      details,
    });
  } catch (err) {
    console.error("❌ Error registrando log de admin:", err);
  }
}

/* ------------------------------------------------------------------
   ⭐ Ruta requerida por tu FRONTEND para finalizar sesión anónima
   ------------------------------------------------------------------ */
router.post("/end/:sessionId", endAnonSession);

/* ------------------------------------------------------------------
   🔄 PING — renovar actividad de la sesión autenticada
   ------------------------------------------------------------------ */
router.post("/ping", authMiddleware, async (req, res) => {
  try {
    const session = await Session.findOne({
      userId: req.user.id,
      isActive: true,
      token: req.token,
    });

    if (session) {
      session.lastActivity = new Date();
      await session.save();
    }

    await logIfAdmin(req, "PING DE SESIÓN", {
      sessionId: session?.sessionId || null,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("❌ Error en ping:", err);
    res.status(500).json({ ok: false });
  }
});

/* ------------------------------------------------------------------
   📌 Obtener todas las sesiones activas del usuario
   ------------------------------------------------------------------ */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({
      userId: req.user.id,
      isActive: true,
    }).sort({ createdAt: -1 });

    await logIfAdmin(req, "VER SESIONES ACTIVAS", {
      total: sessions.length,
    });

    res.json(sessions);
  } catch (err) {
    console.error("❌ Error obteniendo sesiones:", err);
    res.status(500).json({ msg: "Error obteniendo sesiones" });
  }
});

/* ------------------------------------------------------------------
   🔐 Cerrar sesión actual
   ------------------------------------------------------------------ */
router.post("/logout-current", authMiddleware, async (req, res) => {
  try {
    const result = await Session.findOneAndUpdate(
      { token: req.token, isActive: true },
      { isActive: false }
    );

    await logIfAdmin(req, "CERRAR SESIÓN ACTUAL", {
      success: !!result,
    });

    res.json({ msg: "Sesión actual cerrada" });
  } catch (err) {
    console.error("❌ Error cerrando sesión actual:", err);
    res.status(500).json({ msg: "Error cerrando sesión actual" });
  }
});

/* ------------------------------------------------------------------
   🔐 RF3 — Cerrar sesión específica por sessionId
   ------------------------------------------------------------------ */
router.delete("/:sessionId", authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await Session.findOneAndUpdate(
      { sessionId, userId: req.user.id },
      { isActive: false }
    );

    await logIfAdmin(req, "CERRAR SESIÓN POR ID", {
      sessionId,
      success: !!result,
    });

    res.json({ msg: "Sesión cerrada correctamente" });
  } catch (err) {
    console.error("❌ Error cerrando sesión:", err);
    res.status(500).json({ msg: "Error cerrando sesión" });
  }
});

/* ------------------------------------------------------------------
   🔐 Cerrar TODAS las sesiones activas del usuario
   ------------------------------------------------------------------ */
router.post("/logout-all", authMiddleware, async (req, res) => {
  try {
    const result = await Session.updateMany(
      { userId: req.user.id },
      { isActive: false }
    );

    await logIfAdmin(req, "CERRAR TODAS LAS SESIONES", {
      modified: result.modifiedCount,
    });

    res.json({ msg: "Todas las sesiones cerradas" });
  } catch (err) {
    console.error("❌ Error cerrando todas las sesiones:", err);
    res.status(500).json({ msg: "Error cerrando todas las sesiones" });
  }
});

export default router;
