const express = require("express");
const router = express.Router();
const sedesController = require("../controllers/sedes.controller");
const auth = require("../middlewares/auth");

router.post("/sedes", auth(["superadmin"]), sedesController.createSede);
router.get("/sedes", auth(["superadmin", "admin"]), sedesController.getSedesConDatos);
router.put("/sedes/:sedeId", auth(["superadmin"]), sedesController.updateSede);
router.delete("/sedes/:sedeId", auth(["superadmin"]), sedesController.deleteSede);

module.exports = router;