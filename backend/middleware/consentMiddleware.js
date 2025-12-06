// backend/middleware/consentMiddleware.js
import User from "../models/User.js";

export async function consentMiddleware(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.consentimientoDatos) {
      return res.status(403).json({
        msg: "Debes aceptar el consentimiento informado para usar esta función.",
        requiereConsentimiento: true
      });
    }

    next();
  } catch (err) {
    console.error("Error en consentMiddleware:", err);
    res.status(500).json({ msg: "Error verificando consentimiento." });
  }
}
