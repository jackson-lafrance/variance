import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Same Firebase config as web app
const firebaseConfig = {
  apiKey: "AIzaSyCRgnb7qS39a-TZIYWZmp2e931RljuzyvI",
  authDomain: "variance-954d1.firebaseapp.com",
  projectId: "variance-954d1",
  storageBucket: "variance-954d1.firebasestorage.app",
  messagingSenderId: "440364388299",
  appId: "1:440364388299:web:c681042fb360196fbe304e",
  measurementId: "G-2GHQ1KLKB3"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { auth, db };
export default app;

