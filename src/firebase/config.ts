import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCRgnb7qS39a-TZIYWZmp2e931RljuzyvI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "variance-954d1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "variance-954d1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "variance-954d1.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "440364388299",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:440364388299:web:c681042fb360196fbe304e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-2GHQ1KLKB3"
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


