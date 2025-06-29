const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const serviceAccount = require(path.resolve(process.env.FIREBASE_CREDENTIALS_PATH));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Inicializar Firestore
const db = admin.firestore();

// Verificar que auth y firestore estén disponibles
console.log('Firebase Admin inicializado:');
console.log('Auth disponible:', typeof admin.auth === 'function' ? 'Sí' : 'No');
console.log('Firestore disponible:', typeof admin.firestore === 'function' ? 'Sí' : 'No');

module.exports = { admin, db };