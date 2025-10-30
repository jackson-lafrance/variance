# Mobile App Setup Guide

This React Native mobile app extends the Variance Blackjack Trainer web application with mobile-optimized features.

## Prerequisites

- Node.js (v18 or higher)
- React Native CLI
- For iOS: Xcode and CocoaPods
- For Android: Android Studio and Android SDK

## Installation

```bash
cd mobile
npm install
# or
yarn install

# For iOS only
cd ios && pod install && cd ..
```

## Running the App

### iOS
```bash
npm run ios
# or
yarn ios
```

### Android
```bash
npm run android
# or
yarn android
```

## Features

- All web app sections (Blackjack Basics, Card Counting, Simulations, etc.)
- **Start Card Counting** screen - Real-time card counting tracker with:
  - Deck count and penetration selection
  - Running count and true count display
  - Quick buttons for card input (+1, 0, -1)

## Project Structure

```
mobile/
├── src/
│   ├── screens/          # All screen components
│   ├── components/       # Shared components
│   ├── navigation/       # Navigation setup
│   ├── services/         # Shared services (Firebase, etc.)
│   └── utils/           # Utility functions (card counting logic)
├── ios/                  # iOS native code
└── android/              # Android native code
```

## Shared Code

The app shares Firebase configuration and card counting logic with the web app. Firebase config is located in `src/services/firebase.ts`.

