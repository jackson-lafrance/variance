# Variance - Blackjack Trainer

A comprehensive blackjack training application for web and mobile, designed to help aspiring card counters master the game.

## Features

### Web Application
- Blackjack Basics - Learn fundamental rules with interactive simulations
- Card Counting - Master the Hi-Lo counting system with practice drills
- Advanced Simulations - Practice basic strategy, deviations, and full gameplay
- Bankroll Management - Tools and guides for managing your bankroll
- Advanced Techniques - Ace sequencing and advanced counting systems
- Dashboard - Track your casino sessions, bankroll, and statistics with Firebase integration

### Mobile Application (React Native)
- All web app sections accessible on mobile
- Start Card Counting - Real-time card counting tracker:
  - Customizable deck count (1-8 decks)
  - Adjustable penetration (50-90%)
  - Running count and true count display
  - Large touch-friendly buttons for card input (+1, 0, -1)
  - Card history tracking

## Getting Started

### Web Application

```bash
yarn install
yarn start
```

### Mobile Application

```bash
cd mobile
npm install
npm run ios    # or npm run android
```

## Project Structure

```
variance/
├── src/                    # Web application source
│   ├── components/        # React components
│   ├── views/             # Page components
│   ├── contexts/          # React contexts (Auth)
│   ├── firebase/          # Firebase configuration
│   └── data/              # Static data (strategy tables)
├── mobile/                # React Native mobile app
│   ├── src/
│   │   ├── screens/       # Screen components
│   │   ├── navigation/    # Navigation setup
│   │   ├── services/      # Firebase & services
│   │   └── utils/         # Shared utilities
│   ├── ios/               # iOS native code
│   └── android/           # Android native code
└── public/                # Static web assets
```

## Firebase Integration

The app uses Firebase for:
- User authentication (Email/Password)
- Firestore database for session tracking
- Real-time statistics and bankroll management

See `PROJECT_SUMMARY.md` for detailed architecture and setup information.

## Learning Path

1. Start with Blackjack Basics - Learn the rules and basic strategy
2. Practice Basic Strategy - Use the interactive simulations
3. Learn Card Counting - Master the Hi-Lo system
4. Practice Counting - Use the speed drills and simulations
5. Study Deviations - Learn the Illustrious 18
6. Track Your Progress - Use the Dashboard to monitor sessions

## Technologies

### Web
- React 18
- TypeScript
- React Router DOM
- Firebase (Auth & Firestore)
- Recharts (Data visualization)
- Webpack

### Mobile
- React Native 0.73
- React Navigation
- Firebase (shared with web)
- TypeScript
