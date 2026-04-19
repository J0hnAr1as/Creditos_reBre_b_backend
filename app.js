const express = require("express");
const cors = require("cors");

const app = express();

// 🔐 Manejo de errores global (MUY IMPORTANTE)
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT ERROR:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED PROMISE:", err);
});

// 🌍 Middlewares
app.use(cors());
app.use(express.json());

// 🧠 Validación de variables de entorno (ajusta según tu proyecto)
const requiredEnv = [
  "JWT_SECRET",
  // "FIREBASE_PROJECT_ID",
  // "FIREBASE_CLIENT_EMAIL",
  // "FIREBASE_PRIVATE_KEY",
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing ENV: ${key}`);
  }
});

// 🔍 Debug (opcional, puedes quitar luego)
console.log("ENV CHECK JWT:", process.env.JWT_SECRET ? "OK" : "MISSING");

// 📌 Rutas (con protección para detectar errores)
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

// ✅ Ruta raíz (para evitar "Cannot GET /")
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "API funcionando 🚀",
  });
});

// ❌ Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
  });
});

// 💥 Manejo de errores internos
app.use((err, req, res, next) => {
  console.error("ERROR GLOBAL:", err);
  res.status(500).json({
    error: "Error interno del servidor",
  });
});

module.exports = app;