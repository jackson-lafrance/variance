import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Firebase configuration from environment variables
// Note: In webpack, process.env is injected at build time via DefinePlugin
const getEnvVar = (key: string, fallback: string): string => {
  if (typeof process !== 'undefined' && process.env && (process.env as any)[key]) {
    return (process.env as any)[key];
  }
  return fallback;
};

const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY', "AIzaSyCRgnb7qS39a-TZIYWZmp2e931RljuzyvI"),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', "variance-954d1.firebaseapp.com"),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID', "variance-954d1"),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', "variance-954d1.firebasestorage.app"),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', "440364388299"),
  appId: getEnvVar('VITE_FIREBASE_APP_ID', "1:440364388299:web:c681042fb360196fbe304e"),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID', "G-2GHQ1KLKB3")
};

// Initialize Firebase
let app: FirebaseApp;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

// Initialize Firebase services
let auth: Auth;
let db: Firestore;
let analytics: Analytics | null = null;

try {
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Initialize Analytics (only in browser)
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
    } catch (analyticsError) {
      console.warn('Analytics initialization failed:', analyticsError);
    }
  }
} catch (error) {
  console.error('Firebase service initialization error:', error);
  throw error;
}

export { auth, db, analytics };
export default app;


