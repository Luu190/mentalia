import mongoose from "mongoose";

const RiskPhraseHistorySchema = new mongoose.Schema({
  phraseId: { type: mongoose.Schema.Types.ObjectId, ref: "CrisisPhrase", required: true },
  action: { type: String, enum: ["CREATED", "UPDATED", "DELETED"], required: true },
  oldValue: { type: Object },
  newValue: { type: Object },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("RiskPhraseHistory", RiskPhraseHistorySchema);
