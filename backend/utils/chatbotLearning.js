// utils/chatbotLearning.js
import Conversation from "../models/Conversation.js"; // ojo, .js si es módulo ES

export async function analyzeConversations() {
  const convos = await Conversation.find();
  const emotionStats = {};

  for (const convo of convos) {
    for (const msg of convo.messages) {
      if (msg.sender === "bot") continue;
      const lower = msg.text.toLowerCase();
      const positive =
        ["gracias", "mejor", "bien", "tranquil@", "aliviad@", "funcionó"].some(p => lower.includes(p));

      if (!emotionStats[msg.emotion]) {
        emotionStats[msg.emotion] = { positive: 0, total: 0 };
      }

      emotionStats[msg.emotion].total++;
      if (positive) emotionStats[msg.emotion].positive++;
    }
  }

  return emotionStats;
}
