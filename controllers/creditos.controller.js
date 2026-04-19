// controllers/creditos.controller.js
const { db, admin } = require("../config/firebase");

// Función para calcular intereses
function calcularInteres(monto) {
  return monto * 0.20; // 20% de interés
}

// CREATE - Crear crédito en una sede
exports.createCredito = async (req, res) => {
  try {
    const { sedeId } = req.params;
    const { clienteID, cobradorID, montoPrestado, fechaOrigen } = req.body;

    if (!clienteID || !cobradorID || !montoPrestado || !fechaOrigen) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const interes = calcularInteres(montoPrestado);
    const totalAPagar = montoPrestado + interes;

    const creditoRef = await db
      .collection("Creditos")
      .doc(sedeId)
      .collection("creditos")
      .add({
        clienteID,
        cobradorID,
        montoPrestado,
        interes,
        totalAPagar,
        estado: "Pendiente",
        fechaOrigen,
        fechaPago: null,
        montoPagado: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return res.status(201).json({ id: creditoRef.id, message: "Crédito creado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear crédito" });
  }
};

// READ - Listar créditos de una sede
exports.getCreditos = async (req, res) => {
  try {
    const { sedeId } = req.params;
    const snapshot = await db
      .collection("Creditos")
      .doc(sedeId)
      .collection("creditos")
      .get();

    const creditos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json({ creditos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener créditos" });
  }
};

// UPDATE - Registrar pago de crédito
exports.updateCredito = async (req, res) => {
  try {
    const { sedeId, creditoId } = req.params;
    const { montoPagado, fechaPago } = req.body;

    const creditoRef = db.collection("Creditos").doc(sedeId).collection("creditos").doc(creditoId);
    const creditoDoc = await creditoRef.get();

    if (!creditoDoc.exists) {
      return res.status(404).json({ error: "Crédito no encontrado" });
    }

    const credito = creditoDoc.data();
    const nuevoMontoPagado = credito.montoPagado + montoPagado;
    const nuevoMontoPendiente = credito.totalAPagar - nuevoMontoPagado;

    await creditoRef.update({
      montoPagado: nuevoMontoPagado,
      montoPendiente: nuevoMontoPendiente,
      fechaPago: fechaPago || credito.fechaPago,
      estado: nuevoMontoPendiente <= 0 ? "Pago" : "Pendiente",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ message: "Crédito actualizado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar crédito" });
  }
};

// DELETE - Eliminar crédito
exports.deleteCredito = async (req, res) => {
  try {
    const { sedeId, creditoId } = req.params;

    await db.collection("Creditos").doc(sedeId).collection("creditos").doc(creditoId).delete();

    return res.status(200).json({ message: "Crédito eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar crédito" });
  }
};
