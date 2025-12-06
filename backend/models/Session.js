import mongoose from "mongoose";
import { nanoid } from "nanoid";

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    default: () => `sess-${nanoid(16)}`,
    unique: true,
    index: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  token: {
    type: String,
    required: true,
    index: true,
  },

  userAgent: String,
  ip: String,
  location: String,

  isActive: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  lastActivity: {
    type: Date,
    default: Date.now,
  },
});

// INDEX para búsquedas rápidas por usuario
sessionSchema.index({ userId: 1, isActive: 1 });

export default mongoose.model("Session", sessionSchema);
