// backend/controllers/sessionController.js
import Session from "../models/Session.js";
import ChatSession from "../models/ChatSession.js";

// ==========================
// Obtener sesiones activas
// ==========================
export async function getSessions(req, res) {
  try {
    const sessions = await Session.find({
      userId: req.user.id,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(sessions);
  } catch (error) {
    console.error("❌ Error en getSessions:", error);
    return res.status(500).json({ msg: "Error al obtener sesiones" });
  }
}

// ==========================
// Cerrar SOLO una sesión
// ==========================
export async function logoutOne(req, res) {
  try {
    const { sessionId } = req.params;

    await Session.findOneAndUpdate(
      { sessionId, userId: req.user.id },
      { isActive: false }
    );

    return res.json({ msg: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error("❌ Error en logoutOne:", error);
    return res.status(500).json({ msg: "Error al cerrar sesión individual" });
  }
}

// ==========================
// Cerrar SOLO la sesión actual
// ==========================
export async function logoutCurrent(req, res) {
  try {
    await Session.findOneAndUpdate(
      { userId: req.user.id, token: req.token, isActive: true },
      { isActive: false }
    );

    return res.json({ msg: "Sesión actual cerrada correctamente" });
  } catch (error) {
    console.error("❌ Error en logoutCurrent:", error);
    return res.status(500).json({ msg: "Error al cerrar la sesión actual" });
  }
}

// ==========================
// Cerrar TODAS las sesiones
// ==========================
export async function logoutAll(req, res) {
  try {
    await Session.updateMany(
      { userId: req.user.id },
      { isActive: false }
    );

    return res.json({ msg: "Todas las sesiones han sido cerradas" });
  } catch (error) {
    console.error("❌ Error en logoutAll:", error);
    return res.status(500).json({ msg: "Error al cerrar todas las sesiones" });
  }
}

// ==========================
// Cerrar sesión anónima
// ==========================
export async function endAnonSession(req, res) {
  try {
    const { sessionId } = req.params;

    if (!sessionId.startsWith("anon-")) {
      return res.status(400).json({ ok: false, msg: "ID inválido" });
    }

    await ChatSession.findOneAndUpdate(
      { sessionId },
      { endedAt: new Date() }
    );

    return res.json({ ok: true });
  } catch (error) {
    console.error("❌ Error en endAnonSession:", error);
    return res.status(500).json({ ok: false });
  }
}
