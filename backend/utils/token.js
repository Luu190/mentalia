const jwt = require("jsonwebtoken");

const generarToken = (userId) => {
  // Token válido por 30 minutos
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30m" });
};

const verificarToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = { generarToken, verificarToken };
