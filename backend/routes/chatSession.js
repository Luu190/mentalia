// backend/routes/chatSession.js
import express from "express";
import ChatSession from "../models/ChatSession.js";

const router = express.Router();

// 🔥 Cerrar sesión anónima (RF6 + RF11)
router.post("/end/:sessionId", async (req, res) => {
  try {
    await ChatSession.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { endedAt: new Date() }
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("❌ Error cerrando sesión anónima:", err);
    res.status(500).json({ ok: false });
  }
});

export default router;
