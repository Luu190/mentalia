// backend/utils/responseHelper.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const phrasesPath = path.join(__dirname, "../data/empatheticPhrases.json");

// Cargamos TODA la config (base + por emoción si existe)
let empatheticConfig = { base: [] };

try {
  const raw = fs.readFileSync(phrasesPath, "utf8");
  const json = JSON.parse(raw);
  empatheticConfig = json;
} catch (err) {
  console.error("❌ Error cargando frases empáticas:", err);
  empatheticConfig = {
    base: [
      "Entiendo cómo te sientes.",
      "Estoy aquí para escucharte.",
      "Lo que estás viviendo es importante.",
      "Gracias por compartir conmigo cómo te estás sintiendo.",
      "Sé que esto es difícil y que tu reacción es válida, pero no estás sol@."
    ]
  };
}

/**
 * Obtiene una respuesta empática base según emoción.
 * RF7: incluye las frases mínimas requeridas y muchas más.
 */
export function getResponse(emotion = "neutral") {
  const base = Array.isArray(empatheticConfig.base)
    ? empatheticConfig.base
    : [];

  const emotionSpecific = Array.isArray(empatheticConfig[emotion])
    ? empatheticConfig[emotion]
    : [];

  const pool = [...base, ...emotionSpecific];

  if (!pool.length) {
    return "Estoy aquí para apoyarte. Lo que sientes es válido, gracias por confiar en este espacio.";
  }

  const random = pool[Math.floor(Math.random() * pool.length)];
  return random;
}
