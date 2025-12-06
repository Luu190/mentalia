// utils/anonymize.js
// 🟣 Limpieza de datos sensibles para usuarios anónimos (RNF5)

export function anonymizeText(text = "") {
  if (!text || typeof text !== "string") return text;

  let clean = text;

  // 🧹 1. Correos
  clean = clean.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    "[correo]"
  );

  // 🧹 2. Números largos (teléfonos / documentos / cuentas)
  clean = clean.replace(/\b\d{7,15}\b/g, "[numero]");

  // 🧹 3. Nombres comunes (tu lista base)
  const names = [
    "juan", "pedro", "maria", "jose", "ana", "luisa",
    "carlos", "laura", "valentina", "andres",
    "camila", "luis", "john", "mateo", "daniel"
  ];

  names.forEach((name) => {
    const regex = new RegExp("\\b" + name + "\\b", "gi");
    clean = clean.replace(regex, "[nombre]");
  });

  // 🧹 4. Direcciones (calle, cra, carrera, etc.)
  clean = clean.replace(
    /(calle|cra|kra|carrera|avenida|av\.?|av|cll|crr|#)\s*[0-9a-zA-Z\-]+/gi,
    "[direccion]"
  );

  // 🧹 5. Frases tipo "mi nombre es ..."
  clean = clean.replace(
    /mi nombre es [a-zA-Záéíóúñ ]+/gi,
    "mi nombre es [oculto]"
  );

  // 🧹 6. Frases tipo "me llamo ..." o "soy ..."
  clean = clean.replace(
    /(me llamo|soy)\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,20}(\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,20})?/gi,
    "$1 [nombre]"
  );

  // 🧹 7. Nombres compuestos tipo "María Fernanda", "Carlos Pérez"
  clean = clean.replace(
    /\b([A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,20}\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,20})\b/g,
    "[nombre_completo]"
  );

  return clean;
}
