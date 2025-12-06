// backend/controllers/adminLogController.js
import AdminLog from "../models/AdminLog.js";

export async function getAdminLogs(req, res) {
  try {
    /*
      ⭐ RNF9 – Registro de actividad administrativa

      Este endpoint devuelve los últimos 200 logs,
      ordenados del más reciente al más antiguo.

      Incluye:
        - adminId (nombre, email, rol)
        - acción realizada
        - endpoint
        - método
        - IP
        - userAgent (si existe)
        - detalles opcionales
        - timestamps
    */

    const logs = await AdminLog.find({})
      .populate("adminId", "nombre email rol")
      .sort({ createdAt: -1 })
      .limit(200);

    return res.json({
      ok: true,
      count: logs.length,
      logs
    });

  } catch (err) {
    console.error("❌ Error obteniendo logs:", err);

    return res.status(500).json({
      ok: false,
      msg: "Error obteniendo logs del administrador"
    });
  }
}
