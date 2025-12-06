import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import path from "path";
import { fileURLToPath } from "url";

import chatbotRoutes from "./routes/chatbot.js";
import authRoutes from "./routes/auth.js";
import sessionRoutes from "./routes/session.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import chatSessionRoutes from "./routes/chatSession.js";
import alertRoutes from "./routes/alerts.js";
import journalRoutes from "./routes/journal.js";
import psychologistRoutes from "./routes/psychologist.js"; // ⭐ Ya estaba OK

import { cleanInactiveSessions } from "./utils/sessionCleaner.js";
import { checkDailyCriticalAlerts } from "./controllers/alertController.js";
import contentPublicRoutes from "./routes/contentPublic.js";



dotenv.config();

const app = express();

// ============================
// ⚙️ CONFIG PATHS PARA UPLOADS
// ============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================
// 🌐 MIDDLEWARES
// ============================
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// ============================
// 🗂️ SERVIR ARCHIVOS SUBIDOS (RF26)
// ============================
// Esto permite acceder a videos, imágenes y PDFs subidos desde el frontend
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============================
// 🗄️ CONEXIÓN BD
// ============================
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mentalia";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error MongoDB:", err));

// ============================
// 🚏 RUTAS
// ============================
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat-sessions", chatSessionRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/content", contentPublicRoutes);


// ⭐ Ruta principal de la psicóloga (alertas, frases, contenidos, estadísticas…)
app.use("/api/psychologist", psychologistRoutes);

// ============================
// 🧹 LIMPIEZA DE SESIONES
// ============================
setInterval(cleanInactiveSessions, 60 * 1000);

// ============================
// 🚨 CRON PARA ALERTAS CRÍTICAS (opcional activar)
// ============================
// setInterval(() => {
//   checkDailyCriticalAlerts();
// }, 60 * 1000);

// ============================
// 🚀 SERVIDOR
// ============================
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor en http://0.0.0.0:${PORT}`);
});
