// backend/models/ChatSession.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "bot"], required: true },
  text: { type: String, required: true },
  emotion: { type: String, default: "neutral" },
  confidence: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
});

const chatSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  anonymous: { type: Boolean, default: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  // ⭐ Para diferenciar anónimo / registrado
  type: { type: String, enum: ["anonimo", "registrado"], required: true },

  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  endedAt: { type: Date, default: null },
});

chatSessionSchema.set("timestamps", true);

const ChatSession = mongoose.model("ChatSession", chatSessionSchema);
export default ChatSession;
