// backend/utils/sessionCleaner.js
import Session from "../models/Session.js";

export async function cleanInactiveSessions() {
  try {
    const ONE_HOUR = 60 * 60 * 1000;

    const result = await Session.updateMany(
      {
        isActive: true,
        lastActivity: { $lt: new Date(Date.now() - ONE_HOUR) },
      },
      { isActive: false }
    );

    if (result.modifiedCount > 0) {
      console.log(`⏳ ${result.modifiedCount} sesiones marcadas como inactivas`);
    }
  } catch (err) {
    console.error("❌ Error limpiando sesiones inactivas:", err);
  }
}
