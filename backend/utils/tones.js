// utils/tones.js
// 🎚️ Transformación de tono para el chatbot (Formal Empático Cálido)

export const toneTransform = {

  // 🤝 INFORMAL (tal cual)
  informal: (text) => text,

  // 🧑‍⚕️ FORMAL EMPÁTICO CÁLIDO — versión optimizada
  formal: (text) => {
    if (!text) return text;

    let out = text;

    // 1) Quitar TODOS los emojis
    out = out.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "");

    // 2) Sustituciones para mantener tono cálido y profesional
    const replacements = [
      { from: /estoy aquí contigo/gi, to: "estoy aquí para acompañarle" },
      { from: /estoy contigo/gi, to: "estoy aquí para apoyarle" },
      { from: /estoy aquí para escucharte/gi, to: "estoy aquí para escucharle" },
      { from: /si quieres/gi, to: "si lo desea puedo orientarle" },
      { from: /si lo deseas/gi, to: "si lo desea puedo orientarle" },
      { from: /tranquil@/gi, to: "puede tomárselo con calma" },
      { from: /puedo compartirte/gi, to: "puedo compartirle" },
      { from: /compartirte/gi, to: "compartirle" },
      { from: /contigo/gi, to: "con usted" },
      { from: /estás/gi, to: "se encuentra" },
      { from: /sientes/gi, to: "se siente" },
      { from: /tu/gi, to: "su" },
      { from: /tú/gi, to: "usted" }
    ];

    replacements.forEach(r => {
      out = out.replace(r.from, r.to);
    });

    // 3) Quitar espacios dobles
    out = out.replace(/\s{2,}/g, " ");

    // 4) Quitar puntos duplicados
    out = out.replace(/\.{2,}/g, ".");

    return out.trim();
  }
};
