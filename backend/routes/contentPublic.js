import express from "express";
import Content from "../models/Content.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { tipo, categoria, buscar } = req.query;

    const filtro = {};

    if (tipo && tipo !== "todos") filtro.tipo = tipo;
    if (categoria && categoria !== "todos") filtro.categoria = categoria;
    if (buscar) filtro.titulo = { $regex: buscar, $options: "i" };

    const contenido = await Content.find(filtro).sort({ createdAt: -1 });

    res.json(contenido);
  } catch (err) {
    console.error("❌ Error cargando contenido público:", err);
    res.status(500).json({ msg: "Error interno" });
  }
});

export default router;
