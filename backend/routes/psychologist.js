// backend/routes/psychologist.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { logAdminAction } from "../middleware/logAdminAction.js";

// ALERTAS
import {
  getCriticalAlerts,
  resolveAlert,
  getConversationByAlert,
  getPendingCriticalCount,
  getTodayAlerts,
  getActiveChatbotSessions,
} from "../controllers/psychologistController.js";

// FRASES DE RIESGO
import {
  getPhrases,
  createPhrase,
  updatePhrase,
  deletePhrase,
} from "../controllers/riskPhraseAdminController.js";

// ESTADÍSTICAS
import {
  getStats,
  exportPDF,
  exportExcel,
  getDashboardStats,
} from "../controllers/statsController.js";

// BÚSQUEDA
import { searchConversations } from "../controllers/searchController.js";

// CONTENIDOS (RF25–RF29)
import {
  getContents,
  createContent,
  updateContent,
  deleteContent,
} from "../controllers/contentController.js";

// Middleware de subida de archivos
import { uploadContent } from "../middleware/uploadContent.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware, logAdminAction);

// ------- ALERTAS (RF16) -------
router.get("/alerts", getCriticalAlerts);
router.put("/alerts/:id/resolve", resolveAlert);
router.get("/alerts/:alertId/conversation", getConversationByAlert);
router.get("/alerts/pending/count", getPendingCriticalCount);
router.get("/alerts/today", getTodayAlerts);

// ------- BUSCAR (RF21) -------
router.get("/conversations/search", searchConversations);

// ------- SESIONES ACTIVAS -------
router.get("/sessions/active", getActiveChatbotSessions);

// ------- FRASES DE RIESGO (RF23) -------
router.get("/phrases", getPhrases);
router.post("/phrases", createPhrase);
router.put("/phrases/:id", updatePhrase);
router.delete("/phrases/:id", deletePhrase);

// ------- ESTADÍSTICAS -------
router.get("/stats", getStats);
router.get("/stats/pdf", exportPDF);
router.get("/stats/excel", exportExcel);
router.get("/stats/dashboard", getDashboardStats);

/* ============================
   📌 CONTENIDOS (RF25–RF29)
   ============================ */
router.get("/content", getContents);
router.post(
  "/content",
  uploadContent.single("archivo"), // campo "archivo" en FormData
  createContent
);
router.put(
  "/content/:id",
  uploadContent.single("archivo"),
  updateContent
);
router.delete("/content/:id", deleteContent);

export default router;
