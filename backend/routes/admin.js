import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { logAdminAction } from "../middleware/logAdminAction.js";

import {
  getCrisisList,
  addCrisisPhrase,
  deleteCrisisPhrase,
  updateCrisisPhrase
} from "../controllers/adminController.js";

import { getAdminLogs } from "../controllers/adminLogController.js";

const router = express.Router();

// Protegido + log de admin
router.use(authMiddleware, adminMiddleware, logAdminAction);

// RNF9 — ruta para ver los logs
router.get("/logs", getAdminLogs);

// CRUD de frases
router.get("/crisis-phrases", getCrisisList);
router.post("/crisis-phrases", addCrisisPhrase);
router.put("/crisis-phrases/:id", updateCrisisPhrase);
router.delete("/crisis-phrases/:id", deleteCrisisPhrase);

export default router;
