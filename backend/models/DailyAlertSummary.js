// backend/models/DailyAlertSummary.js
import mongoose from "mongoose";

const DailyAlertSummarySchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD
    required: true,
    unique: true
  },
  criticalCount: {
    type: Number,
    default: 0
  },
  notifiedToPsychologist: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("DailyAlertSummary", DailyAlertSummarySchema);
