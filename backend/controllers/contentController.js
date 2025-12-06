// backend/controllers/contentController.js
import Content from "../models/Content.js";
import AdminLog from "../models/AdminLog.js";

// Helper: registrar logs sin romper endpoints
async function safeAdminLog(payload) {
  try {
    await AdminLog.create(payload);
  } catch (err) {
    console.error("❌ Error registrando AdminLog (contenido):", err);
  }
}

/* ============================
   📌 GET /api/psychologist/content
   Listar contenidos + filtros/orden (RF25, RF27, RF29)
   ============================ */
export async function getContents(req, res) {
  try {
    const { categoria, tipo, ordenar } = req.query;

    const filtro = {};
    if (categoria && categoria !== "todos") filtro.categoria = categoria;
    if (tipo && tipo !== "todos") filtro.tipo = tipo;

    let sort = { createdAt: -1 }; // por fecha desc

    if (ordenar === "tipo") sort = { tipo: 1, createdAt: -1 };
    if (ordenar === "categoria") sort = { categoria: 1, createdAt: -1 };

    const contenidos = await Content.find(filtro).sort(sort);

    await safeAdminLog({
      adminId: req.user?.id,
      action: "VER CONTENIDOS",
      endpoint: "/content",
      details: { categoria, tipo, ordenar },
      ip: req.ip,
    });

    res.json(contenidos);
  } catch (err) {
    console.error("❌ Error obteniendo contenidos:", err);
    res.status(500).json({ msg: "Error obteniendo contenidos" });
  }
}

/* ============================
   📌 POST /api/psychologist/content
   Crear contenido (RF25–RF29)
   ============================ */
export async function createContent(req, res) {
  try {
    const {
      titulo,
      descripcion,
      tipo,
      categoria,
      enlace,
      tecnicaTipo,
      creador,
      tags,
    } = req.body;

    const archivoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const contenido = await Content.create({
      titulo,
      descripcion,
      tipo: tipo || "articulo",
      categoria: categoria || "general",
      enlace: enlace || null,
      tecnicaTipo: tipo === "tecnica" ? tecnicaTipo || "otro" : "otro",
      archivoUrl,
      imagenUrl: null,
      creador: creador || req.user?.nombre || "Psicóloga Institucional",
      tags: tags
        ? String(tags)
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    });

    await safeAdminLog({
      adminId: req.user?.id,
      action: "CREAR CONTENIDO",
      endpoint: "/content",
      details: { id: contenido._id, tipo: contenido.tipo },
      ip: req.ip,
    });

    res.status(201).json(contenido);
  } catch (err) {
    console.error("❌ Error creando contenido:", err);
    res.status(500).json({ msg: "Error creando contenido" });
  }
}

/* ============================
   📌 PUT /api/psychologist/content/:id
   Actualizar contenido (RF25–RF29)
   ============================ */
export async function updateContent(req, res) {
  try {
    const { id } = req.params;

    const old = await Content.findById(id);
    if (!old) return res.status(404).json({ msg: "Contenido no encontrado" });

    const {
      titulo,
      descripcion,
      tipo,
      categoria,
      enlace,
      tecnicaTipo,
      creador,
      tags,
    } = req.body;

    const update = {
      titulo: titulo ?? old.titulo,
      descripcion: descripcion ?? old.descripcion,
      tipo: tipo ?? old.tipo,
      categoria: categoria ?? old.categoria,
      enlace: enlace ?? old.enlace,
      tecnicaTipo:
        (tipo || old.tipo) === "tecnica"
          ? tecnicaTipo || old.tecnicaTipo
          : "otro",
      creador: creador ?? old.creador,
      tags: tags
        ? String(tags)
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : old.tags,
    };

    if (req.file) {
      update.archivoUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await Content.findByIdAndUpdate(id, update, {
      new: true,
    });

    await safeAdminLog({
      adminId: req.user?.id,
      action: "ACTUALIZAR CONTENIDO",
      endpoint: "/content/:id",
      details: { id },
      ip: req.ip,
    });

    res.json(updated);
  } catch (err) {
    console.error("❌ Error actualizando contenido:", err);
    res.status(500).json({ msg: "Error actualizando contenido" });
  }
}

/* ============================
   📌 DELETE /api/psychologist/content/:id
   ============================ */
export async function deleteContent(req, res) {
  try {
    const { id } = req.params;

    const found = await Content.findById(id);
    if (!found) return res.status(404).json({ msg: "Contenido no encontrado" });

    await Content.findByIdAndDelete(id);

    await safeAdminLog({
      adminId: req.user?.id,
      action: "ELIMINAR CONTENIDO",
      endpoint: "/content/:id",
      details: { id },
      ip: req.ip,
    });

    res.json({ msg: "Contenido eliminado" });
  } catch (err) {
    console.error("❌ Error eliminando contenido:", err);
    res.status(500).json({ msg: "Error eliminando contenido" });
  }
}
