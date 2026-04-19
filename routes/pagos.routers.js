// routes/pagos.routes.js
const express = require("express");
const router = express.Router();
const pagosController = require("../controllers/pagos.controller");
const verifyToken = require("../middlewares/verifyToken");

// Superadmin puede CRUD completo
router.post("/creditos/:sedeId/:creditoId/pagos", verifyToken(["superadmin"]), pagosController.createPago);
router.put("/creditos/:sedeId/:creditoId/pagos/:pagoId", verifyToken(["superadmin"]), pagosController.updatePago);
router.delete("/creditos/:sedeId/:creditoId/pagos/:pagoId", verifyToken(["superadmin"]), pagosController.deletePago);

// Superadmin y admin pueden leer pagos
router.get("/creditos/:sedeId/:creditoId/pagos", verifyToken(["superadmin", "admin"]), pagosController.getPagos);

module.exports = router;