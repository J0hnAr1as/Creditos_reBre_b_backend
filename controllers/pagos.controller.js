// controllers/pagos.controller.js
const db = require("../config/firebase");

// CREATE - Registrar un pago en un crédito (solo superadmin)
exports.createPago = async (req, res) => {
  try {
    const { sedeId, creditoId } = req.params;
    const { monto, fecha, cobradorID } = req.body;

    if (!monto || !fecha || !cobradorID) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const pagoRef = await db
      .collection("Creditos")
      .doc(sedeId)
      .collection("creditos")
      .doc(creditoId)
      .collection("pagos")
      .add({
        monto,
        fecha,
        cobradorID,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    // Actualizar crédito principal
    const creditoRef = db.collection("Creditos").doc(sedeId).collection("creditos").doc(creditoId);
    const creditoDoc = await creditoRef.get();

    if (creditoDoc.exists) {
      const credito = creditoDoc.data();
      const nuevoMontoPagado = credito.montoPagado + monto;
      const nuevoMontoPendiente = credito.totalAPagar - nuevoMontoPagado;

      await creditoRef.update({
        montoPagado: nuevoMontoPagado,
        montoPendiente: nuevoMontoPendiente,
        estado: nuevoMontoPendiente <= 0 ? "Pago" : "Pendiente",
        fechaPago: nuevoMontoPendiente <= 0 ? fecha : null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return res.status(201).json({ id: pagoRef.id, message: "Pago registrado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al registrar pago" });
  }
};

// READ - Listar pagos de un crédito (superadmin y admin)
exports.getPagos = async (req, res) => {
  try {
    const { sedeId, creditoId } = req.params;
    const snapshot = await db
      .collection("Creditos")
      .doc(sedeId)
      .collection("creditos")
      .doc(creditoId)
      .collection("pagos")
      .get();

    const pagos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json({ pagos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener pagos" });
  }
};

// UPDATE - Modificar un pago (solo superadmin)
exports.updatePago = async (req, res) => {
  try {
    const { sedeId, creditoId, pagoId } = req.params;
    const data = req.body;

    await db
      .collection("Creditos")
      .doc(sedeId)
      .collection("creditos")
      .doc(creditoId)
      .collection("pagos")
      .doc(pagoId)
      .update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return res.status(200).json({ message: "Pago actualizado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar pago" });
  }
};

// DELETE - Eliminar un pago (solo superadmin)
exports.deletePago = async (req, res) => {
  try {
    const { sedeId, creditoId, pagoId } = req.params;

    await db
      .collection("Creditos")
      .doc(sedeId)
      .collection("creditos")
      .doc(creditoId)
      .collection("pagos")
      .doc(pagoId)
      .delete();

    return res.status(200).json({ message: "Pago eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar pago" });
  }
};