# AGENTS.md — Variance Codebase Context

> Blackjack card counting training application with a React web app and React Native mobile app sharing a Firebase backend.

## Agent Requirements

**Work Logging**: Agents MUST document their work in the `logs/` folder using markdown files. Each log entry must include:

- **Detailed timestamps** — Use ISO 8601 format (e.g. `2025-02-26T14:30:00Z`) for all significant actions and milestones
- **Descriptive titles** — Clear, human-readable titles that summarize the work (e.g. `Add dark mode toggle to Settings`)
- **Structured content** — Document decisions, changes made, files touched, and any blockers or follow-ups

Example log filename: `logs/2025-02-26-add-settings-dark-mode.md`. Create or append to logs as work progresses, not only at task completion.

## Quick Reference

| Aspect | Web App | Mobile App |
|---|---|---|
| Framework | React 18 + TypeScript | React Native 0.81 + Expo 54 |
| Routing | React Router DOM v7 | React Navigation 6 (Stack) |
| Styling | CSS files + CSS variables | React Native StyleSheet |
| Bundler | Webpack 5 | Metro (Expo) |
| State | Context API (Auth, Toast) | Context API (Auth, DarkMode) |
| Backend | Firebase (Auth + Firestore) | Firebase (Auth + Firestore) |
| Entry point | `src/index.tsx` | `mobile/App.tsx` |

## Project Structure

```
/
├── src/                         # Web application source
│   ├── index.tsx                # Entry point — mounts React root with providers
│   ├── components/              # Reusable UI components (18 total)
│   ├── views/                   # Route-level page components (13 total)
│   ├── utils/                   # Business logic and Firestore operations
│   ├── contexts/                # React Context providers
│   │   └── AuthContext.tsx      # Auth state: currentUser, signup, login, logout
│   ├── firebase/
│   │   └── config.ts            # Firebase app initialization, exports auth/db/analytics
│   ├── data/
│   │   └── strategyTables.ts    # Static blackjack strategy data (hard/soft/pairs)
│   └── styles/
│       └── theme.css            # Global CSS variables and base styles
├── mobile/                      # React Native (Expo) mobile application
│   ├── App.tsx                  # Mobile root component
│   ├── src/
│   │   ├── screens/             # Screen components (maps to web views/)
│   │   ├── components/          # Mobile-specific reusable components
│   │   ├── navigation/
│   │   │   └── AppNavigator.tsx # Stack navigator (Auth stack vs App stack)
│   │   ├── services/
│   │   │   ├── firebase.ts      # Mobile Firebase config
│   │   │   └── AuthContext.tsx   # Mobile auth context
│   │   ├── contexts/
│   │   │   └── DarkModeContext.tsx
│   │   ├── utils/               # Shared utilities (duplicated from web)
│   │   └── data/
│   │       └── strategyTables.ts
│   ├── package.json             # Mobile-specific dependencies
│   ├── app.json                 # Expo configuration
│   ├── eas.json                 # EAS build profiles
│   └── metro.config.js          # Metro bundler config
├── public/                      # Static web assets (HTML template, favicon, PWA manifest)
├── package.json                 # Web app dependencies and scripts
├── webpack.common.js            # Shared webpack config
├── webpack.dev.js               # Dev server config + env variable injection
├── webpack.prod.js              # Production build config
├── firebase.json                # Firebase Hosting config (serves from dist/)
├── firestore.rules              # Firestore security rules
├── tsconfig.json                # TypeScript config (ES5, React JSX, strict: false)
├── .firebaserc                  # Firebase project: variance-954d1
└── logs/                        # Agent work logs (markdown, detailed timestamps + titles)
```

## Architecture

### Provider Hierarchy (Web)

The web app wraps in this order (see `src/index.tsx`):

```
React.StrictMode
  └── ErrorBoundary
      └── BrowserRouter
          └── AuthProvider          ← Firebase auth state
              └── ToastProvider     ← Toast notification system
                  └── App           ← Route definitions
```

### Routing (Web)

All routes are defined in `src/views/App/App.tsx`. Every view is lazy-loaded via `React.lazy()` with a `Suspense` fallback.

| Route | View Component | Purpose |
|---|---|---|
| `/` | `BlackjackBasics` | Home — blackjack tutorial |
| `/counting` | `CardCountingBasics` | Card counting tutorial |
| `/simulations` | `SimulationPractice` | Practice simulations hub |
| `/bankroll` | `BankrollManagement` | Bankroll management tools |
| `/advanced` | `AdvancedTechniques` | Advanced techniques |
| `/dashboard` | `Dashboard` | Casino session tracking, stats, charts |
| `/settings` | `Settings` | User preferences |
| `/progress` | `ProgressTracking` | Practice progress and goals |
| `/betting` | `BettingCalculator` | Kelly Criterion calculator |
| `/risk` | `RiskCalculator` | Risk of ruin calculator |
| `/privacy` | `PrivacyPolicy` | Privacy policy |
| `/terms` | `TermsOfService` | Terms of service |
| `/auth` | `Auth` | Login/signup |

### Navigation (Mobile)

Defined in `mobile/src/navigation/AppNavigator.tsx`. Uses React Navigation Stack Navigator with conditional rendering:
- **Unauthenticated**: Shows `AuthNavigator` (Auth screen only)
- **Authenticated**: Shows `AppNavigator` (all app screens)

### State Management

No Redux or external state library. Uses React's built-in primitives:

- **AuthContext** (`src/contexts/AuthContext.tsx`): Wraps Firebase Auth. Provides `currentUser`, `signup`, `login`, `logout`, `resetPassword`, `loading`. Consumed via `useAuth()` hook.
- **ToastContext** (`src/components/Toast/Toast.tsx`): Provides `showToast(message, type)` where type is `'success' | 'error' | 'info'`. Consumed via `useToast()` hook.
- **DarkModeContext** (mobile only, `mobile/src/contexts/DarkModeContext.tsx`): Theme toggle for mobile.
- **Component-local state**: All other state lives in components via `useState`/`useEffect`/`useRef`.

## Firebase Integration

### Configuration

- **Web**: `src/firebase/config.ts` — Uses `getEnvVar()` helper that reads `process.env` (injected by webpack `DefinePlugin`) with hardcoded fallbacks.
- **Mobile**: `mobile/src/services/firebase.ts` — Uses `process.env.EXPO_PUBLIC_*` with same fallbacks.

Both export `auth` (Firebase Auth instance), `db` (Firestore instance). Web also exports `analytics`.

### Environment Variables

**Web** (prefixed `VITE_FIREBASE_*`, set in `.env` file, injected at build time by webpack):
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

**Mobile** (prefixed `EXPO_PUBLIC_FIREBASE_*`):
```
EXPO_PUBLIC_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
```

Firebase project ID: `variance-954d1`

### Firestore Collections

All collections enforce user-scoped access via security rules in `firestore.rules`.

| Collection | Document Key | Key Fields | Access Pattern |
|---|---|---|---|
| `userStats` | `{userId}` | `totalBankroll`, `totalProfit`, `totalSessions`, `totalHours` | read/write by owner |
| `userSettings` | `{userId}` | User preferences | read/write by owner |
| `casinoSessions` | Auto-generated | `userId`, `date`, `casino`, `hoursPlayed`, `startingBankroll`, `endingBankroll`, `profit`, `handsPlayed`, `notes`, `timestamp` | CRUD by owner |
| `practiceSessions` | Auto-generated | `userId`, `simulationType`, `accuracy`, `correctCount`, `incorrectCount`, `handsPlayed`, `duration`, `timestamp`, `date` | create + read by owner |
| `highScores` | Auto-generated | `userId`, `simulationType`, `score`, `accuracy`, `handsPlayed`, `correctCount`, `incorrectCount`, `timestamp`, `date` | create + read by owner |
| `goals` | Auto-generated | `userId`, `type` (bankroll/accuracy/sessions/hours), `target`, `current`, `deadline`, `createdAt`, `completed`, `completedAt` | CRUD by owner |

### Firestore Query Pattern

All queries filter by `userId` and require the user to be authenticated. Common pattern:

```typescript
const q = query(
  collection(db, 'collectionName'),
  where('userId', '==', userId),
  orderBy('timestamp', 'desc')
);
const snapshot = await getDocs(q);
```

Errors with `code === 'failed-precondition'` indicate a missing Firestore composite index — functions return empty arrays/null as fallback.

## Component & Module Patterns

### Directory Convention

Every component and view follows the same three-file structure:

```
ComponentName/
├── ComponentName.tsx    # Implementation (default export)
├── ComponentName.css    # Component-scoped styles
└── index.ts             # Barrel: export { default } from './ComponentName'
```

### Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Component files | PascalCase | `CardDrawer.tsx` |
| Utility files | camelCase | `bettingCalculator.ts` |
| CSS files | Match component name | `CardDrawer.css` |
| Functions | camelCase with verb prefix | `savePracticeSession`, `calculateKellyCriterion` |
| Interfaces | PascalCase | `PracticeSession`, `BettingResult` |
| Props interfaces | `{Component}Props` | `CollapsibleSectionProps` |
| CSS classes | kebab-case | `.collapsible-section` |
| Constants | Object with UPPER_SNAKE values | `SimulationTypes.BASIC_STRATEGY` |

### Import Order Convention

1. React core imports
2. Third-party libraries
3. Internal contexts/hooks (`../../contexts/AuthContext`)
4. Utilities (`../../utils/highScores`)
5. Sibling components
6. CSS (`./ComponentName.css`)

All imports use **relative paths** — no path aliases are configured.

### Component Patterns

- All components are **functional** with hooks (only `ErrorBoundary` is a class component)
- Components use **default exports**
- Props are destructured in the function signature
- Side effects use `useEffect`; refs use `useRef`
- Context hooks: `useAuth()`, `useToast()`

### Utility Module Patterns

Utility files in `src/utils/` follow these patterns:

- **Firestore operations** (`practiceSessions.ts`, `highScores.ts`, `goals.ts`): Export async functions named `save*`, `get*`, `create*`, `update*`, `delete*`. All wrap Firestore SDK calls in try-catch with `console.error` logging. Accept `userId` as first parameter.
- **Pure calculations** (`bettingCalculator.ts`, `riskCalculator.ts`): Export pure functions with JSDoc comments. Return typed result interfaces.
- **Dashboard utilities** (`dashboardUtils.ts`): Statistics calculations and data export (CSV/JSON).

### Simulation Types

The app has several practice simulation modes, identified by constants in `src/utils/highScores.ts`:

```typescript
SimulationTypes = {
  BASIC_STRATEGY: 'basic-strategy',
  DEVIATIONS: 'deviations',
  COUNTING: 'counting',
  UNIFIED: 'unified',
  CARD_SPEED: 'card-speed',
}
```

Each maps to a component in `src/components/`: `BasicStrategySimulation`, `DeviationsSimulation`, `BasicHiLoSimulation`, `UnifiedSimulation`, `CardSpeedDrill`.

## Styling System

### CSS Variables (defined in `src/styles/theme.css`)

```css
--color-primary: #2563EB        /* Blue — primary actions */
--color-primary-dark: #1E40AF   /* Darker blue — hover states */
--color-text-primary: #111827   /* Near-black — body text */
--color-text-secondary: #6B7280 /* Gray — secondary text */
--color-background: #FFFFFF     /* White — cards, inputs */
--color-background-light: #F9FAFB /* Off-white — page background */
--color-border: #E5E7EB         /* Light gray — borders */
--color-success: #10B981        /* Green */
--color-error: #EF4444          /* Red */
```

### Dark Mode

Toggled by adding `dark-mode` class to `<body>`. Overrides defined in `theme.css` under `body.dark-mode`. The mobile app uses `DarkModeContext` for theme state.

### Global CSS Classes

- `.btn-primary`, `.btn-secondary` — button styles
- `.card` — card container with border and shadow
- `.gradient-text` — primary color bold text
- `.animate-fade-in`, `.animate-slide-in`, `.animate-scale-in` — entry animations

## Build & Development

### Web App Commands

```bash
yarn install          # Install dependencies
yarn start            # Dev server at localhost:8080 (webpack-dev-server)
yarn build            # Production build to dist/
```

Webpack is configured with three files:
- `webpack.common.js` — Entry point, loaders (ts-loader, babel-loader, css-loader, file-loader), plugins (HtmlWebpackPlugin, CopyWebpackPlugin), resolve extensions
- `webpack.dev.js` — Merges common + development mode, source maps, `DefinePlugin` for env vars
- `webpack.prod.js` — Merges common + production mode, `DefinePlugin` for env vars

Output goes to `dist/`. The dev server has `historyApiFallback: true` for SPA routing.

### Mobile App Commands

```bash
cd mobile
npm install           # Install dependencies
npx expo start        # Start Expo dev server
npx expo run:ios      # Run on iOS simulator
npx expo run:android  # Run on Android emulator
eas build --platform ios --profile production    # Production iOS build
eas build --platform android --profile production # Production Android build
```

### Deployment

- **Web**: Firebase Hosting — `firebase deploy` serves from `dist/`
- **Mobile**: EAS (Expo Application Services) — build profiles in `mobile/eas.json`

## Key Domain Concepts

This is a **blackjack card counting trainer**. Key domain terms:

- **Basic Strategy**: Optimal play decisions based on player hand vs dealer upcard (hard totals, soft totals, pair splitting)
- **Hi-Lo Count**: Card counting system — low cards (2-6) = +1, neutral (7-9) = 0, high cards (10-A) = -1
- **True Count**: Running count divided by remaining decks — used for bet sizing
- **Deviations**: Situations where the count changes the basic strategy play
- **Kelly Criterion**: Mathematical formula for optimal bet sizing based on edge and bankroll
- **Risk of Ruin**: Probability of losing your entire bankroll
- **Betting Spread**: Range from minimum to maximum bet (e.g., 1-12 spread)

### Strategy Table Data Format

`src/data/strategyTables.ts` contains three tables with these legend codes:

**Hard totals**: `E` = Hit, `R` = Stand, `B` = Double (or Hit)
**Soft totals**: `E` = Hit, `R` = Stand, `B` = Double (or Hit), `Br` = Double (or Stand)
**Pair splitting**: `U` = Split, `K` = Don't Split, `U.K` = Split if DAS allowed

## Error Handling

- **Firestore queries**: Try-catch with `failed-precondition` check (missing index) returning empty fallbacks
- **Firebase init**: Errors are caught and re-thrown (fatal)
- **Component errors**: `ErrorBoundary` class component wraps the entire app
- **Unhandled rejections**: `window.addEventListener('unhandledrejection')` in `index.tsx` suppresses benign Firebase `AbortError` from unmounted component navigation
- **Utility functions**: Console.error + re-throw or return empty defaults

## What's Not Configured

- **Testing**: No test framework, no test files (test script is a placeholder)
- **Linting**: No ESLint or Prettier configuration
- **CI/CD**: No GitHub Actions or automated pipelines
- **Docker**: No containerization
- **TypeScript strict mode**: Disabled in web `tsconfig.json` (`strict: false`), enabled in mobile

## Web vs Mobile Code Sharing

The web and mobile apps are **separate codebases** with duplicated utilities. They share:
- The same Firebase project and Firestore collections
- Similar strategy table data structures
- Similar utility logic (betting calculator, risk calculator, practice sessions, high scores)
- Similar screen/view organization

They differ in:
- UI framework (React DOM vs React Native)
- Routing (React Router vs React Navigation)
- Styling (CSS vs StyleSheet)
- Some mobile-specific utilities (e.g., `cardCounting.ts` in mobile only)

When making changes to shared business logic, check both `src/utils/` and `mobile/src/utils/` to keep them in sync.
