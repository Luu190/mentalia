// backend/middleware/adminMiddleware.js
import User from "../models/User.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ msg: "No autenticado." });
    }

    const user = await User.findById(userId);

    if (!user || user.rol !== "admin") {
      return res
        .status(403)
        .json({ msg: "Acceso denegado. Solo administradores." });
    }

    next();
  } catch (error) {
    console.error("Error en adminMiddleware:", error);
    res.status(500).json({ msg: "Error interno del servidor." });
  }
};
