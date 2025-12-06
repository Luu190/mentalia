// backend/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Session from "../models/Session.js";
import sendEmail from "../utils/sendEmail.js";

// 🟢 Registro de usuario (RF1, RF4, RF5, RNF1, RNF10)
export async function registerUser(req, res) {
  try {
    const {
      nombre,
      identificacion,
      edad,
      genero,
      programa,
      ficha,
      telefono,
      email,
      password,

      // ⭐ AGREGADO PARA RNF10
      consentimientoDatos,
    } = req.body;

    if (
      !nombre ||
      !identificacion ||
      !edad ||
      !genero ||
      !programa ||
      !ficha ||
      !telefono ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        msg: "Todos los campos son obligatorios.",
      });
    }

    // ⭐ NUEVO → Validar consentimiento
    if (!consentimientoDatos) {
      return res.status(400).json({
        msg: "Debes aceptar el consentimiento informado.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        msg: "La contraseña debe tener al menos 8 caracteres.",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "El correo ya está registrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nombre,
      identificacion,
      edad,
      genero,
      programa,
      ficha,
      telefono,
      email,
      password: hashedPassword,

      // ⭐ AGREGADO PARA RNF10
      consentimientoDatos: true,
      consentimientoFecha: new Date(),
      consentimientoVersion: "1.0",
    });

    await newUser.save();

    // 📩 Enviar correo de bienvenida MENTALIA
    const html = `
      <div style="font-family: Arial, sans-serif; background: #f6f4fb; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; padding-bottom: 10px;">
          <h2 style="color: #7c3aed;">💜 Bienvenido/a a MENTALIA, ${nombre}</h2>
        </div>

        <p style="font-size: 16px; color: #333;">
          ¡Gracias por unirte! Tu cuenta en <strong>MENTALIA</strong> ha sido creada exitosamente.
        </p>

        <p style="font-size: 15px; color: #444; line-height: 1.6;">
          Esta plataforma ha sido diseñada para brindarte un espacio seguro, 
          confidencial y disponible 24/7 donde podrás:
        </p>

        <ul style="font-size: 15px; color: #444; line-height: 1.6;">
          <li>🧠 Hablar con nuestro chatbot emocional cuando lo necesites.</li>
          <li>📘 Registrar tu diario emocional y entender tus emociones.</li>
          <li>⚠️ Recibir apoyo oportuno si atraviesas un momento difícil.</li>
          <li>📊 Ver tu progreso y bienestar con herramientas claras y fáciles de usar.</li>
        </ul>

        <p style="font-size: 15px; color: #444;">
          En MENTALIA nos importa tu bienestar. No estás solo/a — aquí siempre encontrarás un espacio para ser escuchado/a sin juicios.  
        </p>

        <div style="text-align: center; margin-top: 25px;">
          <a href="http://localhost:3000/login"
            style="background: #7c3aed; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-size: 16px;">
            Iniciar sesión en MENTALIA
          </a>
        </div>

        <p style="margin-top: 25px; font-size: 13px; color: #777; text-align: center;">
          MENTALIA – Plataforma de apoyo emocional para aprendices SENA  
          <br/>Confidencial • Segura • Humana
        </p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Bienvenido/a a MENTALIA 💜 Tu espacio seguro",
      html,
    });

    return res.status(201).json({ msg: "Usuario registrado correctamente." });

  } catch (error) {
    console.error("Error en registerUser:", error);
    return res.status(500).json({
      msg: "Error en el registro.",
      error: error.message,
    });
  }
}

// 🔐 Login de usuario (RF6)
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "Correo y contraseña son obligatorios.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "El usuario no existe o las credenciales son incorrectas.",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ msg: "Credenciales incorrectas." });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔥 Mantengo TODAS tus líneas, solo agrego las que faltaban
    const newSession = new Session({
      userId: user._id,
      token,

      // ⭐ AGREGADO PARA QUE FUNCIONE EL PANEL Y EL CIERRE DE SESIONES
      userAgent: req.headers["user-agent"] || "",
      ip: req.ip || "",
      isActive: true,
      lastActivity: new Date(),

      createdAt: new Date(),
    });

    await newSession.save();

    // Crear cookie HttpOnly
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      msg: "Inicio de sesión exitoso.",
      token,

      // ⭐ AGREGADO — NECESARIO PARA CERRAR SESIONES
      sessionId: newSession.sessionId,

      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        programa: user.programa,
        rol: user.rol,
        tone: user.tone,
        consentimientoDatos: user.consentimientoDatos,
      },
    });

  } catch (error) {
    console.error("Error en loginUser:", error);
    return res.status(500).json({
      msg: "Error al iniciar sesión.",
      error: error.message,
    });
  }
}

// 🔐 Logout seguro
export function logoutUser(req, res) {
  res.clearCookie("token");
  return res.json({ msg: "Sesión cerrada correctamente." });
}
