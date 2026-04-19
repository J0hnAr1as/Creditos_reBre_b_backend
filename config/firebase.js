require("dotenv").config();
const admin = require("firebase-admin");

function makeMissingFirebaseProxy(reason) {
  return new Proxy(
    {},
    {
      get() {
        throw new Error(
          `Firebase no está configurado. ${reason}. ` +
            "Define FIREBASE_SERVICE_ACCOUNT (JSON) y FIREBASE_DATABASE_URL en tu .env."
        );
      },
    }
  );
}

const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
const databaseURL = process.env.FIREBASE_DATABASE_URL;

if (!rawServiceAccount || !databaseURL) {
  // Permite levantar el servidor para probar conectividad (ruta "/"),
  // pero cualquier uso de Firestore fallará con un error claro.
  module.exports = makeMissingFirebaseProxy(
    "Faltan variables de entorno requeridas"
  );
  return;
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(rawServiceAccount);
} catch (e) {
  module.exports = makeMissingFirebaseProxy(
    "FIREBASE_SERVICE_ACCOUNT no es JSON válido"
  );
  return;
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL,
});

module.exports = admin.firestore();


