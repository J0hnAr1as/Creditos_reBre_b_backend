// controllers/cobradores.controller.js
const db = require("../config/firebase");

// CREATE - Agregar cobrador a una sede
exports.createCobrador = async (req, res) => {
  try {
    const { sedeId } = req.params; // ej: sede-cali
    const { nombre, apellido, celular, direccion } = req.body;

    if (!nombre || !apellido || !celular || !direccion) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const cobradorRef = await db
      .collection("Cobradores")
      .doc(sedeId)
      .collection("cobradores")
      .add({
        nombre,
        apellido,
        celular,
        direccion,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return res.status(201).json({ id: cobradorRef.id, message: "Cobrador creado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear cobrador" });
  }
};

// READ - Listar cobradores de una sede
exports.getCobradores = async (req, res) => {
  try {
    const { sedeId } = req.params;
    const snapshot = await db
      .collection("Cobradores")
      .doc(sedeId)
      .collection("cobradores")
      .get();

    const cobradores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json({ cobradores });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener cobradores" });
  }
};

// UPDATE - Actualizar cobrador en una sede
exports.updateCobrador = async (req, res) => {
  try {
    const { sedeId, cobradorId } = req.params;
    const data = req.body;

    await db
      .collection("Cobradores")
      .doc(sedeId)
      .collection("cobradores")
      .doc(cobradorId)
      .update(data);

    return res.status(200).json({ message: "Cobrador actualizado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar cobrador" });
  }
};

// DELETE - Eliminar cobrador de una sede
exports.deleteCobrador = async (req, res) => {
  try {
    const { sedeId, cobradorId } = req.params;

    await db
      .collection("Cobradores")
      .doc(sedeId)
      .collection("cobradores")
      .doc(cobradorId)
      .delete();

    return res.status(200).json({ message: "Cobrador eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar cobrador" });
  }
};