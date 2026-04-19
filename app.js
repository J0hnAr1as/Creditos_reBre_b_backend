const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const requiredEnv = ["JWT_SECRET"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing ENV: ${key}`);
  }
});

app.use("/api/auth", require("./routes/auth.routers"));
app.use("/api/clientes", require("./routes/clientes.routes"));
app.use("/api/creditos", require("./routes/creditos.routes"));
app.use("/api/cobradores", require("./routes/cobradores.routes"));
app.use("/api/usuarios", require("./routes/usuarios.routes"));
app.use("/api/sedes", require("./routes/sedes.routes"));
app.use("/api/pagos", require("./routes/pagos.routers"));

app.get("/", (req, res) => {
  res.json({
    status: "Todo bien, todo bien...",
    message: "API funcionando 🚀",
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error("ERROR GLOBAL:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

module.exports = app;
