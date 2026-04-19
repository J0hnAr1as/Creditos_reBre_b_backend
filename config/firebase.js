const admin = require('firebase-admin');

function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    try {
      const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
      return JSON.parse(decoded);
    } catch (err) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 inválido: ' + err.message);
    }
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch (err) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON inválido: ' + err.message);
    }
  }

  return null;
}

const serviceAccount = loadServiceAccount();

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || undefined
  });
} else if (process.env.FIREBASE_DATABASE_URL) {
  admin.initializeApp({
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
} else {
  throw new Error('Faltan credenciales de Firebase. Define FIREBASE_SERVICE_ACCOUNT_BASE64 o FIREBASE_SERVICE_ACCOUNT_JSON o FIREBASE_DATABASE_URL');
}

const db = admin.firestore();
module.exports = db;


