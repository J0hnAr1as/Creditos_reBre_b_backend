const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/firebase");

const JWT_SECRET = process.env.JWT_SECRET || "cambiar_esta_clave";
const ROLES_PERMITIDOS = ["superadmin", "admin", "user"];
const PASSWORD_ALFANUMERICA = /^[a-z0-9]+$/i;

function normalizeRole(role) {
  if (!role) return role;
  // Acepta "superusuario" como alias
  if (role === "superusuario") return "superadmin";
  if (role === "administrador") return "admin";
  if (role === "usuario") return "user";
  return role;
}

exports.register = async (req, res) => {
  try {
    const {
      usuario, // username
      email, // opcional
      password,
      role: rawRole,
      nombre,
      apellido,
      tel,
      direccion,
    } = req.body;

    const role = normalizeRole(rawRole);

    if (!usuario || !password || !role || !nombre || !apellido || !tel || !direccion) {
      return res.status(400).json({
        error:
          "Todos los campos son requeridos: usuario, password, role, nombre, apellido, tel, direccion",
      });
    }

    if (!ROLES_PERMITIDOS.includes(role)) {
      return res.status(400).json({ error: "Rol inválido" });
    }

    if (!PASSWORD_ALFANUMERICA.test(password)) {
      return res.status(400).json({ error: "La clave debe ser alfanumérica (sin símbolos)" });
    }

    // username único
    const byUser = await db.collection("Usuarios").where("usuario", "==", usuario).get();
    if (!byUser.empty) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // email único si viene
    if (email) {
      const byEmail = await db.collection("Usuarios").where("email", "==", email).get();
      if (!byEmail.empty) {
        return res.status(400).json({ error: "El email ya existe" });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await db.collection("Usuarios").add({
      usuario,
      nombre,
      apellido,
      tel,
      direccion,
      email: email || null,
      passwordHash,
      role,
      createdAt: new Date(),
    });

    return res.status(201).json({ id: newUser.id, message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al registrar usuario" });
  }
};

exports.login = async (req, res) => {
  try {
    const { usuario, email, password, role: rawRole } = req.body;
    const role = normalizeRole(rawRole);

    if ((!usuario && !email) || !password || !role) {
      return res.status(400).json({ error: "Usuario (o email), contraseña y rol son requeridos" });
    }

    if (!ROLES_PERMITIDOS.includes(role)) {
      return res.status(400).json({ error: "Rol inválido" });
    }

    const snapshot = usuario
      ? await db.collection("Usuarios").where("usuario", "==", usuario).get()
      : await db.collection("Usuarios").where("email", "==", email).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "Usuario no existe" });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const isValid = await bcrypt.compare(password, userData.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    if (userData.role !== role) {
      return res.status(403).json({ error: "Rol incorrecto para este usuario" });
    }

    const token = jwt.sign(
      {
        id: userDoc.id,
        usuario: userData.usuario,
        email: userData.email,
        nombre: userData.nombre,
        role: userData.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      token,
      user: {
        id: userDoc.id,
        usuario: userData.usuario,
        nombre: userData.nombre,
        email: userData.email || "",
        role: userData.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al iniciar sesión" });
  }
};