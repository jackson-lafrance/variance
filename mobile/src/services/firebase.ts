import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  // Initialize app only if it hasn't been initialized
  const existingApps = getApps();
  if (existingApps.length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = existingApps[0];
  }

  // Initialize auth with persistence, or get existing auth instance
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch (error: any) {
    // If auth is already initialized, just get the existing instance
    if (error.code === 'auth/already-initialized') {
      auth = getAuth(app);
    } else {
      throw error;
    }
  }

  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { auth, db };
export default app;

