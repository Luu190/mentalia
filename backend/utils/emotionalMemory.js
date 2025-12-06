// backend/utils/emotionalMemory.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { analyzeConversations } from "./chatbotLearning.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEMORY_FILE = path.join(__dirname, "../data/emotionalMemory.json");

// 📦 Cargar memoria emocional (si existe)
export function loadMemory() {
  try {
    if (fs.existsSync(MEMORY_FILE)) {
      const raw = fs.readFileSync(MEMORY_FILE, "utf8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("❌ Error cargando emotionalMemory.json:", err);
  }
  return {};
}

// 💾 Guardar memoria emocional actualizada
function saveMemory(memory) {
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2), "utf8");
  } catch (err) {
    console.error("❌ Error guardando emotionalMemory.json:", err);
  }
}

/**
 * RF11 • Actualizar memoria emocional en base a conversaciones.
 * Usa analyzeConversations() que devuelve:
 * { emocion: { positive: n, total: n } }
 */
export async function updateEmotionalMemory() {
  try {
    const stats = await analyzeConversations(); // ya lo tienes creado
    const memory = loadMemory();

    for (const [emotion, data] of Object.entries(stats)) {
      const total = data.total || 0;
      const positive = data.positive || 0;
      const ratio = total > 0 ? positive / total : 0.5; // neutro si no hay datos

      const prevScore = memory[emotion]?.score ?? 0;

      // Nuevo score suavizado (tipo “aprendizaje”)
      const newScore = prevScore * 0.7 + (ratio - 0.5) * 10 * 0.3;

      memory[emotion] = {
        score: Number(newScore.toFixed(2))
      };
    }

    saveMemory(memory);
    return memory;
  } catch (err) {
    console.error("❌ Error actualizando memoria emocional:", err);
    throw err;
  }
}
