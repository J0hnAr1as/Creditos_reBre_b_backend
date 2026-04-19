// config/firebase.js
const admin = require('firebase-admin');

function loadServiceAccount() {
  // 1) Si guardaste el JSON codificado en base64 en Vercel
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    try {
      const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
      return JSON.parse(decoded);
    } catch (err) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 no es JSON válido después de decodificar: ' + err.message);
    }
  }

  // 2) Si guardaste el JSON directamente (menos recomendable)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch (err) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON no es JSON válido: ' + err.message);
    }
  }

  // 3) Si no hay credencial de servicio, devolvemos null
  return null;
}

const serviceAccount = loadServiceAccount();

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || undefined
  });
} else if (process.env.FIREBASE_DATABASE_URL) {
  // Inicializar con solo databaseURL si usas reglas públicas o token distinto
  admin.initializeApp({
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
} else {
  throw new Error('No se encontraron credenciales de Firebase. Define FIREBASE_SERVICE_ACCOUNT_BASE64 o FIREBASE_SERVICE_ACCOUNT_JSON o FIREBASE_DATABASE_URL');
}

const db = admin.firestore();
module.exports = db;

