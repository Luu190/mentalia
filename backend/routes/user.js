// backend/routes/user.js
import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔄 Actualizar tono preferido del chatbot (formal / informal)
router.patch("/tone", authMiddleware, async (req, res) => {
  const { tone } = req.body;

  if (!["informal", "formal"].includes(tone)) {
    return res.status(400).json({ msg: "Tono inválido" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    user.tone = tone;
    await user.save();

    return res.json({ msg: "Tono actualizado", tone: user.tone });
  } catch (err) {
    console.error("Error actualizando tono:", err);
    return res.status(500).json({ msg: "Error actualizando tono" });
  }
});

export default router;
