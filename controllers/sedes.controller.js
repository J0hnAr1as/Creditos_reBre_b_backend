// controllers/sedes.controller.js
const { db, admin } = require("../config/firebase");

// CREATE - Crear sede en todas las colecciones
exports.createSede = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre de la sede es requerido" });

    const sedeId = `sede-${nombre.toLowerCase()}`;
    const colecciones = ["Clientes", "Cobradores", "Creditos", "Usuarios"];

    const batch = db.batch();
    colecciones.forEach((col) => {
      const sedeRef = db.collection(col).doc(sedeId);
      batch.set(sedeRef, {
        nombre,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    return res.status(201).json({ message: `Sede ${nombre} creada en todas las colecciones` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear sede" });
  }
};

// READ - Listar todas las sedes con sus subcolecciones
exports.getSedesConDatos = async (req, res) => {
  try {
    const colecciones = ["Clientes", "Cobradores", "Creditos", "Usuarios"];
    const sedesPorColeccion = {};

    for (const col of colecciones) {
      const snapshot = await db.collection(col).get();
      sedesPorColeccion[col] = [];

      for (const doc of snapshot.docs) {
        const sedeData = { id: doc.id, ...doc.data(), subcoleccion: [] };
        const subColName = col.toLowerCase();

        const subSnapshot = await doc.ref.collection(subColName).get();
        sedeData.subcoleccion = subSnapshot.docs.map(subDoc => ({
          id: subDoc.id,
          ...subDoc.data(),
        }));

        sedesPorColeccion[col].push(sedeData);
      }
    }

    return res.status(200).json({ sedes: sedesPorColeccion });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener sedes con datos" });
  }
};

// UPDATE - Actualizar nombre de la sede en todas las colecciones
exports.updateSede = async (req, res) => {
  try {
    const { sedeId } = req.params;
    const { nuevoNombre } = req.body;

    if (!nuevoNombre) return res.status(400).json({ error: "El nuevo nombre es requerido" });

    const colecciones = ["Clientes", "Cobradores", "Creditos", "Usuarios"];
    const batch = db.batch();

    colecciones.forEach((col) => {
      const sedeRef = db.collection(col).doc(sedeId);
      batch.update(sedeRef, { nombre: nuevoNombre });
    });

    await batch.commit();
    return res.status(200).json({ message: `Sede ${sedeId} actualizada a ${nuevoNombre}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar sede" });
  }
};

// DELETE - Eliminar sede en todas las colecciones
exports.deleteSede = async (req, res) => {
  try {
    const { sedeId } = req.params;
    const colecciones = ["Clientes", "Cobradores", "Creditos", "Usuarios"];
    const batch = db.batch();

    colecciones.forEach((col) => {
      const sedeRef = db.collection(col).doc(sedeId);
      batch.delete(sedeRef);
    });

    await batch.commit();
    return res.status(200).json({ message: `Sede ${sedeId} eliminada de todas las colecciones` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar sede" });
  }
};