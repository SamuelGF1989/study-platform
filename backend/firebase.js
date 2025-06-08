// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./ruta/a/tu/serviceAccountKey.json'); // Descárgalo desde Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
