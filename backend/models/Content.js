// backend/models/Content.js
import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    // Título del recurso (artículo, video, técnica, etc.)
    titulo: { type: String, required: true },

    // Descripción / cuerpo corto
    descripcion: { type: String, required: true },

    // Tipo de contenido (RF25, RF26, RF28, RF29)
    // articulo = artículo/tema de interés
    // video = video propio / cápsula
    // tecnica = técnica validada
    // recurso = enlaces a podcasts, libros, etc.
    tipo: {
      type: String,
      enum: ["articulo", "video", "tecnica", "recurso"],
      default: "articulo",
    },

    // Categoría emocional / temática (RF27)
    categoria: {
      type: String,
      default: "general",
    },

    // Nombre visible del creador
    creador: {
      type: String,
      default: "Psicóloga Institucional",
    },

    // Fecha de creación visible
    fecha: {
      type: Date,
      default: Date.now,
    },

    // Archivo subido (imagen, pdf, video) — RF26
    archivoUrl: {
      type: String,
      default: null,
    },

    // Imagen opcional asociada
    imagenUrl: {
      type: String,
      default: null,
    },

    // Enlace externo (podcast, libro, video sugerido) — RF29
    enlace: {
      type: String,
      default: null,
    },

    // Tipo de técnica (respiración, journaling, distracción) — RF28
    tecnicaTipo: {
      type: String,
      enum: ["respiracion", "journaling", "distraccion", "otro"],
      default: "otro",
    },

    // Tags opcionales
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Content", ContentSchema);
