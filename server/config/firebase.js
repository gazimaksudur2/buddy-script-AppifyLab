const admin = require('firebase-admin');
const path = require('path');

let firebaseApp;

try {
  // Try to initialize with service account file
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const serviceAccount = require(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH));
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } 
  // Fallback to environment variables
  else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      })
    });
  } else {
    console.warn('⚠️  Firebase Admin SDK not configured. Please set up Firebase credentials in .env file.');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
}

module.exports = admin;

