// js/firebase-config.js
// Firebase SDKs loaded via CDN in index.html (or other pages) before this script

// TODO: Replace this with your actual Firebase config object from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase only if the script is loaded
let app, auth, db;
if (typeof firebase !== 'undefined') {
  app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
  
  // Enable offline persistence for Firestore
  db.enablePersistence().catch(err => {
    console.warn("Firestore offline persistence error:", err.code);
  });
} else {
  console.error("Firebase SDK not loaded before firebase-config.js");
}
