// backend/controllers/journalController.js
import JournalEntry from "../models/JournalEntry.js";
import { normalizeEmotion } from "../utils/emotionAnalyzer.js";

export async function createEntry(req, res) {
  try {
    const { title, emotion, note, tags, date, intensity } = req.body;
    const userId = req.user.id;

    // 🧠 Normalizar emoción: si no viene, la inferimos del note/title
    const normalizedEmotion = normalizeEmotion(
      emotion || note || title || ""
    );

    const entry = await JournalEntry.create({
      userId,
      title,
      emotion: normalizedEmotion,
      note,
      tags,
      date: date ? new Date(date) : new Date(),
      intensity
    });

    return res.status(201).json(entry);
  } catch (error) {
    console.error("Error creando entrada:", error);
    res.status(500).json({ msg: "Error creando entrada." });
  }
}

export async function getEntries(req, res) {
  try {
    const userId = req.user.id;

    const entries = await JournalEntry.find({ userId }).sort({ date: -1 });

    return res.status(200).json(entries);
  } catch (error) {
    console.error("Error obteniendo entradas:", error);
    res.status(500).json({ msg: "Error obteniendo entradas." });
  }
}

export async function deleteEntry(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await JournalEntry.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({ msg: "Entrada no encontrada." });
    }

    res.status(200).json({ msg: "Entrada eliminada." });
  } catch (error) {
    console.error("Error eliminando entrada:", error);
    res.status(500).json({ msg: "Error eliminando entrada." });
  }
}

export async function updateEntry(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, emotion, note, tags, date, intensity } = req.body;

    const normalizedEmotion = normalizeEmotion(
      emotion || note || title || ""
    );

    const updated = await JournalEntry.findOneAndUpdate(
      { _id: id, userId },
      {
        title,
        emotion: normalizedEmotion,
        note,
        tags,
        date: date ? new Date(date) : new Date(),
        intensity
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Entrada no encontrada." });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error actualizando entrada:", error);
    res.status(500).json({ msg: "Error actualizando entrada." });
  }
}
