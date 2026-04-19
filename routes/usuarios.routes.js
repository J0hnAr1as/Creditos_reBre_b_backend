// routes/usuarios.routes.js
const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios.controller");
const verifyToken = require("../middlewares/verifyToken");

// Superadmin puede CRUD completo
router.post("/usuarios/:sedeId", verifyToken(["superadmin"]), usuariosController.createUsuario);
router.put("/usuarios/:sedeId/:usuarioId", verifyToken(["superadmin"]), usuariosController.updateUsuario);
router.delete("/usuarios/:sedeId/:usuarioId", verifyToken(["superadmin"]), usuariosController.deleteUsuario);
router.put("/usuarios/:sedeId/:usuarioId/desactivar", verifyToken(["superadmin"]), usuariosController.desactivarUsuario);

// Superadmin y admin pueden leer usuarios
router.get("/usuarios/:sedeId", verifyToken(["superadmin", "admin"]), usuariosController.getUsuarios);

module.exports = router;