// backend/models/Conversation.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "bot"], required: true },
  text: { type: String, required: true },
  emotion: { type: String, default: "neutral" },

  createdAt: { type: Date, default: Date.now },

  // ⭐ AGREGADO para que el frontend tenga fecha válida
  timestamp: { type: Date, default: Date.now } 
});

const conversationSchema = new mongoose.Schema({
  sessionId: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  type: { type: String, enum: ["anonimo", "registrado"], required: true },
  messages: [messageSchema],
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date }
});

conversationSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 600 });
conversationSchema.set("timestamps", true);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
