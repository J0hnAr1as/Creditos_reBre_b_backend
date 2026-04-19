const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/firebase.config");

const JWT_SECRET = process.env.JWT_SECRET || "cambiar_esta_clave";

exports.register = async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body;

    if (!nombre || !email || !password || !role) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const rolesPermitidos = ["superadmin", "admin", "user"];
    if (!rolesPermitidos.includes(role)) {
      return res.status(400).json({ error: "Rol inválido" });
    }

    const snapshot = await db.collection("Usuarios").where("email", "==", email).get();
    if (!snapshot.empty) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await db.collection("Usuarios").add({
      nombre,
      email,
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    const snapshot = await db.collection("Usuarios").where("email", "==", email).get();
    if (snapshot.empty) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const isValid = await bcrypt.compare(password, userData.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: userDoc.id, email: userData.email, nombre: userData.nombre, role: userData.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      token,
      user: {
        id: userDoc.id,
        nombre: userData.nombre,
        email: userData.email,
        role: userData.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al iniciar sesión" });
  }
};