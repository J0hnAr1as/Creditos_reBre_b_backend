const db = require("../config/firebase");

// Crear usuario
exports.createUsuario = async (req, res) => {
  res.json({ message: "createUsuario OK" });
};

// Actualizar usuario
exports.updateUsuario = async (req, res) => {
  res.json({ message: "updateUsuario OK" });
};

// Eliminar usuario
exports.deleteUsuario = async (req, res) => {
  res.json({ message: "deleteUsuario OK" });
};

// Desactivar usuario
exports.desactivarUsuario = async (req, res) => {
  res.json({ message: "desactivarUsuario OK" });
};

// Obtener usuarios
exports.getUsuarios = async (req, res) => {
  res.json({ message: "getUsuarios OK" });
};