// controllers/usuarios.controller.js
const db = require("../config/firebase");
const bcrypt = require("bcryptjs");

// 📌 Crear usuario
exports.createUsuario = async (req, res) => {
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

    return res.status(201).json({ id: newUser.id, message: "Usuario creado exitosamente" });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return res.status(500).json({ error: "Error interno al crear usuario" });
  }
};

// 📌 Obtener todos los usuarios
exports.getUsuarios = async (req, res) => {
  try {
    const snapshot = await db.collection("Usuarios").get();
    const usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return res.status(500).json({ error: "Error interno al obtener usuarios" });
  }
};

// 📌 Obtener un usuario por ID
exports.getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("Usuarios").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return res.status(500).json({ error: "Error interno al obtener usuario" });
  }
};

// 📌 Actualizar usuario
exports.updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, role } = req.body;

    const docRef = db.collection("Usuarios").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (email) updateData.email = email;
    if (role) {
      const rolesPermitidos = ["superadmin", "admin", "user"];
      if (!rolesPermitidos.includes(role)) {
        return res.status(400).json({ error: "Rol inválido" });
      }
      updateData.role = role;
    }
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    await docRef.update(updateData);

    return res.status(200).json({ message: "Usuario actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return res.status(500).json({ error: "Error interno al actualizar usuario" });
  }
};

// 📌 Eliminar usuario
exports.deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection("Usuarios").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await docRef.delete();

    return res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({ error: "Error interno al eliminar usuario" });
  }
};
