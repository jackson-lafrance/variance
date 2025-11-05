# Variance - Blackjack Training App

## Project Overview
A comprehensive blackjack training application for web and mobile, designed to help aspiring card counters master the game through interactive simulations, practice drills, and tracking tools.

## Architecture

### Web Application (React + TypeScript)
- **Framework**: React with React Router
- **Styling**: CSS with CSS Variables for theming
- **State Management**: React Context API (Auth, Dark Mode)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Build Tool**: Webpack

### Mobile Application (React Native + Expo)
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Database**: Firebase Firestore (shared with web)
- **Authentication**: Firebase Auth (shared with web)

## Key Features

### Web Features
1. **Blackjack Basics** - Interactive guide with strategy tables
2. **Card Counting** - Hi-Lo system training with drills
3. **Simulations** - Multiple practice modes:
   - Basic Strategy Practice
   - Hi-Lo Counting Practice
   - Split/Double Practice
   - Deviations Practice
   - Unified Full Game Simulation
   - Card Speed Drill
4. **Dashboard** - Track casino sessions, bankroll, and statistics
5. **Progress Tracking** - View accuracy trends and practice history
6. **Betting Calculator** - Kelly Criterion bet sizing
7. **Risk Calculator** - Risk of Ruin calculations
8. **Bankroll Management** - Tools and guides
9. **Advanced Techniques** - Ace sequencing and advanced systems

### Mobile Features
- All web app sections accessible
- **Start Card Counting** - Real-time counting tracker with deck count selection
- Touch-optimized controls
- Dark mode support

## Project Structure

```
variance/
├── src/                    # Web application source
│   ├── components/        # React components
│   ├── views/             # Page components
│   ├── contexts/          # React contexts (Auth, DarkMode)
│   ├── firebase/          # Firebase configuration
│   ├── utils/             # Utility functions
│   ├── data/              # Static data (strategy tables)
│   └── styles/            # Global styles (theme.css)
├── mobile/                # React Native mobile app
│   ├── src/
│   │   ├── screens/       # Screen components
│   │   ├── navigation/    # Navigation setup
│   │   ├── services/      # Firebase & services
│   │   ├── components/    # Shared components
│   │   └── utils/         # Shared utilities
│   ├── ios/               # iOS native code
│   └── android/           # Android native code
└── public/                # Static web assets
```

## Technology Stack

### Web
- React 18
- TypeScript
- React Router v6
- Firebase (Auth, Firestore)
- Recharts (data visualization)
- Webpack

### Mobile
- React Native
- Expo
- React Navigation
- Firebase (Auth, Firestore)
- AsyncStorage

## Firebase Collections

1. **userStats** - User statistics (bankroll, sessions, hours)
2. **casinoSessions** - Individual casino session records
3. **highScores** - Simulation high scores
4. **practiceSessions** - Practice session history
5. **userSettings** - User preferences

## Development

### Web
```bash
yarn install
yarn start
```

### Mobile
```bash
cd mobile
npm install
npm run ios    # or npm run android
```

## Environment Variables

Firebase configuration is loaded from environment variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Create a `.env` file in the root directory with these variables.

## Design System

- **Colors**: CSS variables defined in `src/styles/theme.css`
- **Typography**: Inter font family
- **Spacing**: Consistent padding/margins using CSS variables
- **Dark Mode**: Supported via CSS variables and DarkModeContext

## Navigation

- **Web**: Header with InlineNavigation dropdown, Sign In/Logout buttons, Dark Mode toggle
- **Mobile**: React Navigation stack navigator with header

## Security

- Firebase Security Rules enforce user data isolation
- Environment variables for sensitive configuration
- Error boundaries for graceful error handling

## Deployment

### Web
- Build: `yarn build`
- Deploy: Configure hosting (Vercel, Netlify, Firebase Hosting)

### Mobile
- Build: `eas build` (requires Expo Application Services)
- Deploy: App Store Connect (iOS), Google Play Console (Android)

