const express = require("express");
const router = express.Router();
const cobradoresController = require("../controllers/cobradores.controller");
const verifyToken = require("../middlewares/verifyToken");

// CRUD de cobradores dentro de una sede
router.post("/cobradores/:sedeId", verifyToken(["superadmin", "admin", "user"]), cobradoresController.createCobrador);
router.get("/cobradores/:sedeId", verifyToken(["superadmin", "admin", "user"]), cobradoresController.getCobradores);
router.put("/cobradores/:sedeId/:cobradorId", verifyToken(["superadmin", "admin", "user"]), cobradoresController.updateCobrador);
router.delete("/cobradores/:sedeId/:cobradorId", verifyToken(["superadmin", "admin"]), cobradoresController.deleteCobrador);

module.exports = router;
