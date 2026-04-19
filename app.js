const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

try {
  app.use("/auth", require("./routes/auth.routers"));
  console.log("auth OK");
} catch (e) {
  console.error("auth ERROR", e);
}

try {
  app.use("/clientes", require("./routes/clientes.routes"));
  console.log("clientes OK");
} catch (e) {
  console.error("clientes ERROR", e);
}

try {
  app.use("/creditos", require("./routes/creditos.routes"));
  console.log("creditos OK");
} catch (e) {
  console.error("creditos ERROR", e);
}

try {
  app.use("/cobradores", require("./routes/cobradores.routes"));
  console.log("cobradores OK");
} catch (e) {
  console.error("cobradores ERROR", e);
}

try {
  app.use("/usuarios", require("./routes/usuarios.routes"));
  console.log("usuarios OK");
} catch (e) {
  console.error("usuarios ERROR", e);
}

try {
  app.use(require("./routes/sedes.routes"));
  console.log("sedes OK");
} catch (e) {
  console.error("sedes ERROR", e);
}

try {
  app.use(require("./routes/pagos.routers"));
  console.log("pagos OK");
} catch (e) {
  console.error("pagos ERROR", e);
}
module.exports = app;