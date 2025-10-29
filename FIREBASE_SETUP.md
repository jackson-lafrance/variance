# Firebase Setup Instructions

## Prerequisites
You'll need a Firebase account. If you don't have one, sign up at https://firebase.google.com/

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "Blackjack Trainer")
4. Follow the setup wizard (you can disable Google Analytics if you want)
5. Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web** icon (`</>`) to add a web app
2. Register your app with a nickname (e.g., "Blackjack Trainer Web")
3. **Check the box** for "Also set up Firebase Hosting" if you plan to deploy
4. Click "Register app"

## Step 3: Get Your Firebase Configuration

After registering your app, Firebase will show you a code snippet that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**Copy this entire object.**

## Step 4: Update the Config File

1. Open the file: `src/firebase/config.ts`
2. Replace the placeholder `firebaseConfig` object with your actual Firebase configuration
3. Save the file

Your file should look like this:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",  // Your actual values here
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
```

## Step 5: Enable Authentication

1. In the Firebase Console, go to **Build** → **Authentication**
2. Click "Get started"
3. Click on the **Sign-in method** tab
4. Click on **Email/Password**
5. Toggle **Enable** to ON
6. Click **Save**

## Step 6: Set Up Firestore Database

1. In the Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Select **Start in test mode** (for development)
   - **Important:** For production, you'll want to set up proper security rules
4. Choose a Cloud Firestore location (pick one close to your users)
5. Click **Enable**

## Step 7: Configure Firestore Security Rules (Recommended)

1. In Firestore, click on the **Rules** tab
2. Replace the rules with the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User stats - users can only read/write their own stats
    match /userStats/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Casino sessions - users can only read/write their own sessions
    match /casinoSessions/{sessionId} {
      allow read, write: if request.auth != null && 
                            request.resource.data.userId == request.auth.uid;
    }
    
    // Simulation high scores - users can only write their own, but can read all for leaderboards
    match /highScores/{scoreId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **Publish**

## Step 8: Test Your Setup

1. Run your development server: `yarn start`
2. Navigate to the Sign In page (`/auth`)
3. Try creating an account
4. If successful, you should be redirected and see your dashboard

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure you've enabled Email/Password authentication in Firebase Console
- Check that your API key is correct in `config.ts`

### "Missing or insufficient permissions"
- Make sure you've published your Firestore security rules
- Make sure you're signed in when trying to access protected data

### Build errors
- Make sure you've saved `config.ts` after updating it
- Try clearing cache: `rm -rf node_modules/.cache && yarn start`

## What Gets Stored in Firestore

### Collections:

1. **userStats** - One document per user
   - `totalBankroll`: Current total bankroll
   - `totalProfit`: Lifetime profit/loss
   - `totalSessions`: Number of casino sessions tracked
   - `totalHours`: Total hours played

2. **casinoSessions** - Multiple documents per user
   - `date`: Session date
   - `casino`: Casino name
   - `hoursPlayed`: Duration of session
   - `startingBankroll`: Money started with
   - `endingBankroll`: Money ended with
   - `profit`: Net profit/loss
   - `handsPlayed`: (optional) Number of hands
   - `notes`: (optional) Session notes
   - `userId`: Reference to user
   - `timestamp`: Unix timestamp for sorting

3. **highScores** (future feature) - Simulation high scores
   - Will be used to track accuracy in practice simulations
   - Can be used for leaderboards

## Security Best Practices

1. **Never commit your Firebase config to public repositories**
   - Add `src/firebase/config.ts` to `.gitignore` if sharing code
   - Or use environment variables for the config values

2. **Use test mode only during development**
   - In production, implement proper security rules

3. **Monitor usage in Firebase Console**
   - Keep an eye on the Usage tab to avoid unexpected costs
   - Firebase has a generous free tier (50k reads, 20k writes per day)

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth/web/start)


