// backend/routes/chatbot.js
import express from "express";
import { handleAnonChat, handleAuthChat } from "../controllers/chatbotController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { consentMiddleware } from "../middleware/consentMiddleware.js";

const router = express.Router();

// 🟣 Chat para sesión anónima
router.post("/anonimo", handleAnonChat);

// 🔵 Chat para usuario autenticado con consentimiento obligatorio
router.post(
  "/autenticado",
  authMiddleware,
  consentMiddleware,
  handleAuthChat
);

export default router;
