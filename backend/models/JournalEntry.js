import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  title: { type: String, required: true },               // 💜 TÍTULO
  emotion: { type: String, required: true },             // 💜 Feliz / Ansioso / Normal
  note: { type: String, required: true },                // 💜 TEXTO DEL DIARIO

  tags: [{ type: String }],                              // 💜 Chips de colores

  date: { type: Date, required: true },                  // 💜 Fecha completa (día + hora)

  intensity: { type: Number, min: 1, max: 10 },          // para gráficos RF14
});

export default mongoose.model("JournalEntry", journalEntrySchema);
