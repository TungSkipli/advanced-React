const admin = require('firebase-admin');
const serviceAccount = require('../../project-learning-9fdad-firebase-adminsdk-fbsvc-04b5710c11.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

module.exports = {
    admin,
    db,
    auth,
    storage
}