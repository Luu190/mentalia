// backend/scripts/createAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📌 Conectado a MongoDB");

    const email = "yesicamarcelaibanezalvarez@gmail.com";

    const exists = await User.findOne({ email });
    if (exists) {
      console.log("⚠️ Ya existe un usuario con ese correo.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("AdminMentalia2025*", 10);

    const admin = await User.create({
      nombre: "Psicóloga Institucional",
      identificacion: "0000000000",
      edad: 30,
      genero: "Femenino",
      programa: "Psicología",
      ficha: "ADMIN",
      telefono: "0000000000",
      email,
      password: hashedPassword,
      rol: "admin"
    });

    console.log("✅ Administrador creado exitosamente:");
    console.log(admin);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creando admin:", err);
    process.exit(1);
  }
}

createAdmin();
