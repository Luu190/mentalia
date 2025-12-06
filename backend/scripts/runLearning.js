// backend/scripts/runLearning.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { analyzeAndAdapt } from "../utils/empathyLearner.js";

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");
    await analyzeAndAdapt();
    console.log("🧠 Proceso de aprendizaje empático finalizado");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error ejecutando aprendizaje:", error);
    process.exit(1);
  }
})();
