import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCRgnb7qS39a-TZIYWZmp2e931RljuzyvI",
  authDomain: "variance-954d1.firebaseapp.com",
  projectId: "variance-954d1",
  storageBucket: "variance-954d1.firebasestorage.app",
  messagingSenderId: "440364388299",
  appId: "1:440364388299:web:c681042fb360196fbe304e",
  measurementId: "G-2GHQ1KLKB3"
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


