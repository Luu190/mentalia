// backend/routes/journal.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { consentMiddleware } from "../middleware/consentMiddleware.js";

import {
  createEntry,
  getEntries,
  deleteEntry,
  updateEntry
} from "../controllers/journalController.js";

const router = express.Router();

/*
  🟣 RNF10 – Todas las rutas del diario emocional requieren:
      1. Usuario autenticado
      2. Haber aceptado consentimiento informado
*/

// Crear entrada
router.post("/", authMiddleware, consentMiddleware, createEntry);

// Obtener todas las entradas
router.get("/", authMiddleware, consentMiddleware, getEntries);

// Editar entrada
router.put("/:id", authMiddleware, consentMiddleware, updateEntry);

// Eliminar entrada
router.delete("/:id", authMiddleware, consentMiddleware, deleteEntry);

export default router;
