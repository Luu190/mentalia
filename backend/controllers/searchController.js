import Conversation from "../models/Conversation.js";
import ChatSession from "../models/ChatSession.js";

/**
 * RF21 — Buscar en conversaciones por palabra clave
 */
export const searchConversations = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim().length < 2) {
      return res.status(400).json({ msg: "Debe ingresar una palabra válida." });
    }

    const regex = new RegExp(keyword, "i"); // búsqueda insensible a mayúsculas

    // Buscar en conversaciones de usuarios registrados
    const registered = await Conversation.find({
      "messages.text": regex,
    }).lean();

    // Buscar en sesiones anónimas
    const anonymous = await ChatSession.find({
      "messages.text": regex,
    }).lean();

    const resultados = [];

    const addResults = (list, tipo) => {
      for (const convo of list) {
        const coincidencias = convo.messages.filter((m) =>
          regex.test(m.text)
        );

        resultados.push({
          conversationId: convo._id,
          sessionId: convo.sessionId,
          tipoUsuario: tipo,
          coincidencias,
          totalCoincidencias: coincidencias.length,
          createdAt: convo.createdAt,
        });
      }
    };

    addResults(registered, "registrado");
    addResults(anonymous, "anonimo");

    res.json(resultados);
  } catch (err) {
    console.error("❌ Error en searchConversations:", err);
    res.status(500).json({ msg: "Error buscando conversaciones." });
  }
};
