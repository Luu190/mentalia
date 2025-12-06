// backend/models/CrisisPhrase.js
import mongoose from "mongoose";

const crisisPhraseSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },

  // categoría clínica para RF9
  category: {
    type: String,
    enum: ["suicidio", "autolesion", "ideacion_muerte", "violencia", "otro"],
    default: "suicidio",
  },

  // nivel de gravedad
  severity: {
    type: String,
    enum: ["alto", "medio", "bajo"],
    default: "alto",
  },

  // hacia quién va el riesgo
  target: {
    type: String,
    enum: ["self", "others", "unspecified"],
    default: "self",
  },

  // ===============================
  // 🆕 CAMPOS PARA MÓDULO PSICÓLOGA
  // ===============================

  // RF23 – poder activar/desactivar frase sin eliminarla
  active: {
    type: Boolean,
    default: true
  },

  // RF23 – fecha de última modificación
  lastModifiedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("CrisisPhrase", crisisPhraseSchema);
