// backend/routes/alerts.js
import express from "express";
import {
  getAlerts,
  getFilteredAlerts,
  updateAlertStatus
} from "../controllers/alertController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { logAdminAction } from "../middleware/logAdminAction.js";

const router = express.Router();

/*
  ⭐ Todas las rutas de ALERTAS son exclusivamente para administradores
     RNF9 se cumple con logAdminAction
     adminMiddleware asegura que solo la psicóloga acceda
*/

// Middlewares globales para este módulo
router.use(authMiddleware, adminMiddleware, logAdminAction);

// ===============================
// Obtener TODAS las alertas
// ===============================
router.get("/", getAlerts);

// ===============================
// Obtener alertas filtradas
// query: ?estado=...&riesgo=...
// ===============================
router.get("/filter", getFilteredAlerts);

// ===============================
// Actualizar estado de una alerta
// PUT /api/alerts/:id
// ===============================
router.put("/:id", updateAlertStatus);

export default router;
