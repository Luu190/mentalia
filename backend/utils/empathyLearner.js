// backend/utils/empathyLearner.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Conversation from "../models/Conversation.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESPONSES_PATH = path.join(__dirname, "../data/emotional_responses.json");

/**
 * Analiza conversaciones guardadas y mejora el repertorio de respuestas
 * basado en la frecuencia de reacciones positivas (“gracias”, “mejor”, etc.)
 */
export async function analyzeAndAdapt() {
  try {
    const convos = await Conversation.find();
    if (convos.length === 0) return;

    const emotionStats = {};
    const positiveWords = ["gracias", "mejor", "tranquil@", "aliviad@", "sirvió", "ayudó", "bien"];

    for (const convo of convos) {
      for (let i = 0; i < convo.messages.length; i++) {
        const msg = convo.messages[i];

        // Solo analizamos respuestas del usuario después de una del bot
        if (msg.sender === "user" && i > 0 && convo.messages[i - 1].sender === "bot") {
          const prevBot = convo.messages[i - 1];
          const lower = msg.text.toLowerCase();
          const positive = positiveWords.some((w) => lower.includes(w));

          if (!emotionStats[prevBot.emotion]) {
            emotionStats[prevBot.emotion] = { total: 0, positive: 0, phrases: {} };
          }

          emotionStats[prevBot.emotion].total++;
          if (positive) {
            emotionStats[prevBot.emotion].positive++;
            emotionStats[prevBot.emotion].phrases[prevBot.text] =
              (emotionStats[prevBot.emotion].phrases[prevBot.text] || 0) + 1;
          }
        }
      }
    }

    const responses = JSON.parse(fs.readFileSync(RESPONSES_PATH, "utf8"));

    // Ajustar frases según su tasa de éxito
    for (const [emotion, data] of Object.entries(emotionStats)) {
      const successRate = (data.positive / data.total) * 100;
      if (successRate > 70) {
        const topPhrases = Object.entries(data.phrases)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2)
          .map(([text]) => text);

        responses[emotion] = [...new Set([...(responses[emotion] || []), ...topPhrases])];
      }
    }

    fs.writeFileSync(RESPONSES_PATH, JSON.stringify(responses, null, 2), "utf8");
    console.log("✅ Aprendizaje empático completado con éxito.");
  } catch (error) {
    console.error("❌ Error en aprendizaje empático:", error);
  }
}
