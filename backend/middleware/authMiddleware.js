// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import Session from "../models/Session.js";

export async function authMiddleware(req, res, next) {
  try {
    let token = null;

    // Desde el header Authorization
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Desde cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ msg: "No hay token." });
    }

    // Validar JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ msg: "Token inválido." });
    }

    // Validar sesión activa
    const session = await Session.findOne({
      token,
      userId: decoded.id,
      isActive: true,
    });

    if (!session) {
      return res.status(401).json({ msg: "Sesión no encontrada o cerrada." });
    }

    // Expiración por inactividad (1 hora)
    const ONE_HOUR = 60 * 60 * 1000;
    if (Date.now() - session.lastActivity > ONE_HOUR) {
      session.isActive = false;
      await session.save();
      return res.status(440).json({ msg: "Sesión expirada por inactividad." });
    }

    // Actualizar actividad
    session.lastActivity = new Date();
    await session.save();

    // Adjuntar usuario a la request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol,
    };

    req.token = token;

    next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    res.status(401).json({ msg: "Error de autenticación." });
  }
}
