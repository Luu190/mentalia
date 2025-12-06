// backend/models/Alert.js
import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  phrase: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["suicidio", "autolesion", "ideacion_muerte", "violencia", "otro"],
    default: "suicidio"
  },
  severity: {
    type: String,
    enum: ["alto", "medio", "bajo"],
    default: "alto"
  },
  target: {
    type: String,
    enum: ["self", "others", "unspecified"],
    default: "self"
  },
  sessionId: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ["anonimo", "registrado"],
    required: true
  },
  userId: {
    type: String,
    default: null
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pendiente", "atendida"],
    default: "pendiente"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  // ===============================
  // 🆕 CAMPOS NUEVOS PARA PSICÓLOGA
  // ===============================

  // Lista completa de frases coincidentes (RF21 – filtrado por palabras clave)
  matchedPhrases: [{ type: String }],

  // Nivel numérico para análisis avanzado (RF22 / RF18)
  riskLevel: { type: Number, default: 1 },

  // Relación con Conversation para RF16
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    default: null
  },

  // Para RF19 (notificación inmediata)
  notifiedAt: {
    type: Date,
    default: null
  },

  // Para RF16 – distinguir alertas críticas
  isCritical: {
    type: Boolean,
    default: false
  },

  // Para RF16 / RF23 – marcado por psicóloga
  resolved: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("Alert", alertSchema);
