const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// rutas públicas
app.use("/auth", require("./routes/auth.routers"));

// rutas protegidas
app.use("/clientes", require("./routes/clientes.routes"));
app.use("/creditos", require("./routes/creditos.routes"));
app.use("/cobradores", require("./routes/cobradores.routes"));
app.use("/usuarios", require("./routes/usuarios.routes"));
app.use(require("./routes/sedes.routes"));
app.use(require("./routes/pagos.routers"));

module.exports = app;