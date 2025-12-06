// backend/controllers/adminController.js
import CrisisPhrase from "../models/CrisisPhrase.js";

// ✅ Obtener todas las frases de riesgo
export const getCrisisList = async (req, res) => {
  try {
    const list = await CrisisPhrase.find().sort({ category: 1 });
    res.json(list);
  } catch (err) {
    console.error("Error obteniendo frases de riesgo:", err);
    res.status(500).json({ msg: "Error obteniendo frases de riesgo." });
  }
};

// ✅ Crear nueva frase de riesgo
export const addCrisisPhrase = async (req, res) => {
  try {
    const { text, category, severity, target } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ msg: "El texto de la frase es obligatorio." });
    }

    const phrase = await CrisisPhrase.create({
      text: text.toLowerCase(),
      category: category || "suicidio",
      severity: severity || "alto",
      target: target || "self",
    });

    res.status(201).json(phrase);
  } catch (err) {
    console.error("Error agregando frase de riesgo:", err);
    res.status(500).json({ msg: "Error agregando frase de riesgo." });
  }
};

// ✅ Actualizar frase de riesgo
export const updateCrisisPhrase = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, category, severity, target } = req.body;

    const updated = await CrisisPhrase.findByIdAndUpdate(
      id,
      {
        ...(text ? { text: text.toLowerCase() } : {}),
        ...(category ? { category } : {}),
        ...(severity ? { severity } : {}),
        ...(target ? { target } : {}),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Frase no encontrada." });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error actualizando frase de riesgo:", err);
    res.status(500).json({ msg: "Error actualizando frase de riesgo." });
  }
};

// ✅ Eliminar frase de riesgo
export const deleteCrisisPhrase = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await CrisisPhrase.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ msg: "Frase no encontrada." });
    }

    res.json({ msg: "Frase eliminada correctamente." });
  } catch (err) {
    console.error("Error eliminando frase de riesgo:", err);
    res.status(500).json({ msg: "Error eliminando frase de riesgo." });
  }
};
