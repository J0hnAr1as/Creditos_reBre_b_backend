const { db, admin } = require("../config/firebase");

// CREATE - Agregar cliente a una sede
exports.createCliente = async (req, res) => {
  try {
    const { sedeId } = req.params; // ej: sede-cali
    const { nombre, apellido, tel, direccion, cobradorID } = req.body;

    if (!nombre || !apellido || !tel || !direccion || !cobradorID) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const clienteRef = await db
      .collection("Clientes")
      .doc(sedeId)
      .collection("clientes")
      .add({
        nombre,
        apellido,
        tel,
        direccion,
        cobradorID,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return res.status(201).json({ id: clienteRef.id, message: "Cliente creado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear cliente" });
  }
};

// READ - Listar clientes de una sede
exports.getClientes = async (req, res) => {
  try {
    const { sedeId } = req.params;
    const snapshot = await db
      .collection("Clientes")
      .doc(sedeId)
      .collection("clientes")
      .get();

    const clientes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json({ clientes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener clientes" });
  }
};

// UPDATE - Actualizar cliente en una sede
exports.updateCliente = async (req, res) => {
  try {
    const { sedeId, clienteId } = req.params;
    const data = req.body;

    await db
      .collection("Clientes")
      .doc(sedeId)
      .collection("clientes")
      .doc(clienteId)
      .update(data);

    return res.status(200).json({ message: "Cliente actualizado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar cliente" });
  }
};

// DELETE - Eliminar cliente de una sede
exports.deleteCliente = async (req, res) => {
  try {
    const { sedeId, clienteId } = req.params;

    await db
      .collection("Clientes")
      .doc(sedeId)
      .collection("clientes")
      .doc(clienteId)
      .delete();

    return res.status(200).json({ message: "Cliente eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar cliente" });
  }
};
