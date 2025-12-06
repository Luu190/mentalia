import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

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
import psychologistRoutes from "./routes/psychologist.js";
import contentPublicRoutes from "./routes/contentPublic.js";

import { cleanInactiveSessions } from "./utils/sessionCleaner.js";

// ============================
// PATH CONFIG
// ============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ============================
// CORS CONFIG
// ============================
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// ============================
// STATIC FILES
// ============================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============================
// DATABASE
// ============================
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error MongoDB:", err));

// ============================
// ROUTES
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
app.use("/api/psychologist", psychologistRoutes);

// ============================
// SESSION CLEANER
// ============================
setInterval(cleanInactiveSessions, 60 * 1000);

// ============================
// HEALTH CHECK (RENDER NECESITA /healthz )
// ============================
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// También dejamos /health por si lo necesitas
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// ============================
// SERVER START
// ============================
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});
