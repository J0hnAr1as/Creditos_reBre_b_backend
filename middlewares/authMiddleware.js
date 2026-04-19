const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "cambiar_esta_clave";

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ msg: "No autorizado" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token inválido" });
  }
};