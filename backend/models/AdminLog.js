// backend/models/AdminLog.js
import mongoose from "mongoose";

const AdminLogSchema = new mongoose.Schema(
  {
    // ADMIN QUE REALIZÓ LA ACCIÓN
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ACCIÓN REALIZADA (ej: "CREAR FRASE", "VER ALERTAS")
    action: {
      type: String,
      required: true,
    },

    // ENDPOINT ACCEDIDO
    endpoint: {
      type: String,
      required: true,
    },

    // MÉTODO HTTP (GET, POST, PUT...)
    method: {
      type: String,
      default: "UNKNOWN",
    },

    // 👇 NUEVO: ÉXITO O FALLO DE LA OPERACIÓN
    success: {
      type: Boolean,
      default: true,
    },

    // 👇 NUEVO: Nivel de severidad (para auditorías)
    severity: {
      type: String,
      enum: ["info", "warning", "danger"],
      default: "info",
    },

    // 👇 NUEVO: Guarda el navegador, SO y dispositivo
    userAgent: {
      type: String,
      default: "",
    },

    // 👇 NUEVO: Objeto flexible para datos extra
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // IP del dispositivo
    ip: {
      type: String,
    },
  },

  // ⏱️ Mongoose agrega createdAt + updatedAt automáticamente
  { timestamps: true }
);

export default mongoose.model("AdminLog", AdminLogSchema);
