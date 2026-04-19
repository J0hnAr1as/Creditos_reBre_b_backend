const express = require("express");
const router = express.Router();
const creditosController = require("../controllers/creditos.controller");
const verifyToken = require("../middlewares/verifyToken");

router.post("/creditos/:sedeId", verifyToken(["superadmin", "admin", "user"]), creditosController.createCredito);
router.get("/creditos/:sedeId", verifyToken(["superadmin", "admin", "user"]), creditosController.getCreditos);
router.put("/creditos/:sedeId/:creditoId", verifyToken(["superadmin", "admin", "user"]), creditosController.updateCredito);
router.delete("/creditos/:sedeId/:creditoId", verifyToken(["superadmin", "admin"]), creditosController.deleteCredito);

module.exports = router;