const express = require("express");
const router = express.Router();
const clientesController = require("../controllers/clientes.controller");
const auth = require("../middlewares/auth");

router.post("/clientes/:sedeId", auth(["superadmin", "admin", "user"]), clientesController.createCliente);
router.get("/clientes/:sedeId", auth(["superadmin", "admin", "user"]), clientesController.getClientes);
router.put("/clientes/:sedeId/:clienteId", auth(["superadmin", "admin", "user"]), clientesController.updateCliente);
router.delete("/clientes/:sedeId/:clienteId", auth(["superadmin", "admin"]), clientesController.deleteCliente);

module.exports = router;


