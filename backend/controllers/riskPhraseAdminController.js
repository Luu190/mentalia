import CrisisPhrase from "../models/CrisisPhrase.js";
import RiskPhraseHistory from "../models/RiskPhraseHistory.js";
import AdminLog from "../models/AdminLog.js";

async function logHistory(phraseId, action, oldValue, newValue, userId) {
  try {
    await RiskPhraseHistory.create({
      phraseId,
      action,
      oldValue,
      newValue,
      performedBy: userId
    });
  } catch (err) {
    console.error("❌ Error guardando historial de frase:", err);
  }
}

async function safeAdminLog(payload) {
  try {
    await AdminLog.create(payload);
  } catch (err) {
    console.error("❌ Error registrando AdminLog (frases):", err);
  }
}

export async function getPhrases(req, res) {
  try {
    const list = await CrisisPhrase.find().sort({ createdAt: -1 });

    // RNF9
    await safeAdminLog({
      adminId: req.user?.id,
      action: "VER FRASES DE RIESGO",
      endpoint: "/phrases",
      ip: req.ip
    });

    res.json(list);
  } catch (err) {
    console.error("❌ Error obteniendo frases:", err);
    res.status(500).json({ msg: "Error obteniendo frases" });
  }
}

export async function createPhrase(req, res) {
  try {
    const { text, category, severity, target } = req.body;

    const phrase = await CrisisPhrase.create({
      text,
      category,
      severity: severity || "alto",
      target: target || "self",
      active: true
    });

    await logHistory(phrase._id, "CREATED", null, phrase.toObject(), req.user?.id);

    // RNF9
    await safeAdminLog({
      adminId: req.user?.id,
      action: "CREAR FRASE DE RIESGO",
      endpoint: "/phrases",
      details: { text, category, severity: phrase.severity, target: phrase.target },
      ip: req.ip
    });

    res.json(phrase);
  } catch (err) {
    console.error("❌ Error creando frase:", err);
    res.status(500).json({ msg: "Error creando frase" });
  }
}

export async function updatePhrase(req, res) {
  try {
    const { id } = req.params;

    const old = await CrisisPhrase.findById(id);
    if (!old) return res.status(404).json({ msg: "Frase no encontrada" });

    const updated = await CrisisPhrase.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    await logHistory(id, "UPDATED", old.toObject(), updated.toObject(), req.user?.id);

    // RNF9
    await safeAdminLog({
      adminId: req.user?.id,
      action: "ACTUALIZAR FRASE DE RIESGO",
      endpoint: "/phrases/:id",
      details: { id, body: req.body },
      ip: req.ip
    });

    res.json(updated);
  } catch (err) {
    console.error("❌ Error actualizando frase:", err);
    res.status(500).json({ msg: "Error actualizando frase" });
  }
}

export async function deletePhrase(req, res) {
  try {
    const phrase = await CrisisPhrase.findById(req.params.id);
    if (!phrase) return res.status(404).json({ msg: "No encontrada" });

    await logHistory(phrase._id, "DELETED", phrase.toObject(), null, req.user?.id);

    await phrase.deleteOne();

    // RNF9
    await safeAdminLog({
      adminId: req.user?.id,
      action: "ELIMINAR FRASE DE RIESGO",
      endpoint: "/phrases/:id",
      details: { id: req.params.id },
      ip: req.ip
    });

    res.json({ msg: "Frase eliminada" });
  } catch (err) {
    console.error("❌ Error eliminando frase:", err);
    res.status(500).json({ msg: "Error eliminando frase" });
  }
}
