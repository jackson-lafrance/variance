# AGENTS.MD – Context Guide for AI Agents

This document helps new agents quickly gather context and work effectively in the Variance codebase. Read this first before exploring.

---

## 1. Project Overview

**Variance** is a blackjack training application with:
- **Web app** (React + TypeScript, Webpack)
- **Mobile app** (React Native + Expo)

Both share Firebase (Auth, Firestore) and core domain logic. The app teaches blackjack basics, Hi-Lo card counting, deviations (Illustrious 18), and provides simulations, calculators, and progress tracking.

---

## 2. Directory Structure (Key Paths)

```
/workspace
├── src/                          # Web app source
│   ├── index.tsx                 # Entry point, provider hierarchy
│   ├── components/               # Reusable components (one folder per component)
│   │   ├── Auth/                 # Sign in, sign up, password reset
│   │   ├── Header/               # Top nav with InlineNavigation, Sign In/Logout, DarkModeToggle
│   │   ├── InlineNavigation/     # Dropdown nav (Learn, Practice, Dashboard, Settings)
│   │   ├── Toast/                # useToast(), showToast() – notifications
│   │   ├── *Simulation/          # BlackjackSimulation, BasicStrategySimulation, etc.
│   │   └── ...
│   ├── views/                    # Page-level components (routes)
│   │   ├── App/App.tsx            # Routes definition – ADD NEW ROUTES HERE
│   │   ├── Dashboard/            # Casino sessions, bankroll, stats
│   │   ├── SimulationPractice/   # Unified simulation with settings
│   │   └── ...
│   ├── contexts/                 # AuthContext (useAuth)
│   ├── firebase/config.ts        # auth, db, analytics – Firebase entry
│   ├── data/strategyTables.ts    # Basic strategy (hard, soft, pairs)
│   ├── utils/                    # Firebase helpers, calculators
│   └── styles/theme.css          # CSS variables, dark mode
├── mobile/                       # React Native app
│   ├── App.tsx                   # DarkModeProvider → AuthProvider → RootNavigator
│   ├── src/
│   │   ├── screens/              # One screen per route (mirrors web views)
│   │   ├── navigation/AppNavigator.tsx  # Auth gate, stack navigator
│   │   ├── services/AuthContext   # Mobile Auth (different path than web!)
│   │   ├── contexts/DarkModeContext
│   │   ├── components/           # Mobile-specific components
│   │   ├── data/strategyTables   # Copy of web strategy tables
│   │   └── utils/                # Shared logic (bettingCalculator, etc.)
│   └── app.json, eas.json
├── public/                       # Static assets (index.html, favicon, manifest)
├── webpack.common.js             # Build config
├── webpack.dev.js                # Dev server, DefinePlugin for env vars
├── firestore.rules               # Firestore security rules
├── firebase.json                 # Hosting, Firestore config
└── package.json                  # Web deps (yarn)
```

---

## 3. Tech Stack

| Layer | Web | Mobile |
|-------|-----|--------|
| Framework | React 18, TypeScript | React Native 0.81, Expo 54 |
| Routing | React Router DOM 7 | React Navigation 6 (stack) |
| Auth | Firebase Auth | Firebase Auth (shared) |
| DB | Firestore | Firestore (shared) |
| Build | Webpack 5 | Expo/Metro |
| Charts | Recharts | — |

---

## 4. Entry Points & Provider Hierarchy

### Web (`src/index.tsx`)
```
ErrorBoundary
  → BrowserRouter
    → AuthProvider
      → ToastProvider
        → App (Routes)
```

### Mobile (`mobile/App.tsx`)
```
DarkModeProvider
  → AuthProvider (from mobile/src/services/AuthContext)
    → RootNavigator (auth gate: currentUser ? AppNavigator : AuthNavigator)
```

**Important:** Web AuthContext is at `src/contexts/AuthContext.tsx`. Mobile AuthContext is at `mobile/src/services/AuthContext.tsx` – different paths.

---

## 5. Routing

### Web Routes (`src/views/App/App.tsx`)
| Path | View |
|------|------|
| `/` | BlackjackBasics |
| `/counting` | CardCountingBasics |
| `/simulations` | SimulationPractice |
| `/bankroll` | BankrollManagement |
| `/advanced` | AdvancedTechniques |
| `/dashboard` | Dashboard |
| `/settings` | Settings |
| `/progress` | ProgressTracking |
| `/betting` | BettingCalculator |
| `/risk` | RiskCalculator |
| `/privacy` | PrivacyPolicy |
| `/terms` | TermsOfService |
| `/auth` | Auth |

Views are lazy-loaded via `React.lazy()`. Add new routes in `App.tsx` and ensure the view has an `index.ts` barrel export.

### Mobile
Screens mirror web. **StartCardCounting** is mobile-only (real-time counting tracker).

---

## 6. Firebase

### Config (`src/firebase/config.ts`)
- Exports: `auth`, `db`, `analytics`
- Env vars: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc.
- Webpack injects via `DefinePlugin` in `webpack.dev.js` and `webpack.prod.js`
- Mobile uses `EXPO_PUBLIC_FIREBASE_*` (Expo convention)

### Collections (see `firestore.rules`)
| Collection | Purpose | Key Fields |
|------------|---------|------------|
| `userStats` | Per-user stats (bankroll, sessions, hours) | `userId` (doc ID) |
| `casinoSessions` | Individual session records | `userId` |
| `practiceSessions` | Practice session history | `userId`, `simulationType`, `accuracy` |
| `highScores` | Simulation high scores | `userId`, `simulationType` |
| `userSettings` | User preferences | `userId` (doc ID) |
| `goals` | User goals | `userId` |

### Utils for Firestore
- `src/utils/practiceSessions.ts` – save/get practice sessions
- `src/utils/highScores.ts` – high scores
- `src/utils/goals.ts` – goals CRUD
- Dashboard: direct `collection()`, `doc()`, `setDoc()`, etc. in `Dashboard.tsx`
- Settings: `userSettings` in `Settings.tsx`

---

## 7. Common Patterns & Conventions

### Auth
```ts
import { useAuth } from '../contexts/AuthContext';
const { currentUser, signup, login, logout, resetPassword, loading } = useAuth();
```

### Toasts
```ts
import { useToast } from '../components/Toast';
const { showToast } = useToast();
showToast('Message', 'success' | 'error' | 'info');  // default: 'info'
```

### Styling
- Use CSS variables from `src/styles/theme.css` (e.g. `var(--color-primary)`)
- Dark mode: `body.dark-mode` class; components inherit
- Component CSS: co-located `ComponentName.css` in component folder

### Component Structure
- One folder per component: `ComponentName/ComponentName.tsx`, `ComponentName.css`, `index.ts`
- Barrel: `export { default } from './ComponentName'`

### Adding a Route
1. Create view in `src/views/ViewName/`
2. Add `index.ts` with `export { default } from './ViewName'`
3. In `App.tsx`: `const ViewName = lazy(() => import('../ViewName'));`
4. Add `<Route path="/path" element={<ViewName />} />`
5. Add to `InlineNavigation` sections if needed

---

## 8. Domain Concepts (Blackjack)

- **Hi-Lo**: 2–6 = +1, 7–9 = 0, 10–A = -1
- **Running count**: Sum of Hi-Lo values as cards are dealt
- **True count**: Running count ÷ decks remaining
- **Illustrious 18**: 18 main deviations from basic strategy
- **Basic strategy**: From `strategyTables.ts` – hard totals, soft totals, pair splitting

### Simulation Modes (SimulationPractice)
- `full` – Complete game
- `basic` – Basic strategy only
- `deviations` – Illustrious 18
- `soft`, `hard`, `pairs`, `doubling` – Focused practice

---

## 9. Key Files for Common Tasks

| Task | Primary File(s) |
|------|-----------------|
| Add route | `src/views/App/App.tsx`, `InlineNavigation/InlineNavigation.tsx` |
| Firebase read/write | `src/firebase/config.ts`, `src/utils/*.ts`, `firestore.rules` |
| Auth flow | `src/contexts/AuthContext.tsx`, `src/components/Auth/` |
| Styling/theming | `src/styles/theme.css` |
| Simulation logic | `src/data/strategyTables.ts`, `src/components/*Simulation/` |
| Dashboard data | `src/views/Dashboard/Dashboard.tsx` |
| Mobile parity | `mobile/src/screens/`, `mobile/src/navigation/AppNavigator.tsx` |

---

## 10. Search Hints (Grep Patterns)

| Looking for | Pattern |
|-------------|---------|
| Route definitions | `path="/` in `App.tsx` |
| Firebase collections | `collection(db, '` |
| Auth usage | `useAuth()` |
| Toast usage | `useToast()` or `showToast` |
| Nav links | `InlineNavigation` sections |
| Strategy table usage | `strategyTables` |
| Env vars | `VITE_FIREBASE_` or `EXPO_PUBLIC_` |

---

## 11. Gotchas & Pitfalls

1. **AbortError**: Unhandled Firebase abort errors on route change are suppressed in `src/index.tsx` (benign).
2. **Mobile Auth path**: `mobile/src/services/AuthContext` – not under `contexts/`.
3. **Webpack env**: `process.env.VITE_FIREBASE_*` is injected at build time; no runtime `.env` in browser.
4. **Firestore indexes**: Composite queries (e.g. `userId` + `simulationType` + `orderBy`) may need indexes; check Firebase console.
5. **Progress/ProgressTracking**: Gated by `currentUser` in InlineNavigation.
6. **Shared code**: `strategyTables`, `bettingCalculator`, `riskCalculator`, etc. exist in both `src/` and `mobile/src/` – keep in sync when changing.

---

## 12. Context Gathering Strategy for Agents

When starting a task:

1. **Read this file** – Get structure, patterns, key paths.
2. **Identify scope** – Web only, mobile only, or both?
3. **Locate entry points** – Use "Key Files" table; open 1–2 files max.
4. **Follow imports** – Trace from route/view to components/utils.
5. **Check Firebase** – If data-related, read `firestore.rules` and relevant utils.
6. **Avoid broad searches** – Use specific grep patterns from Section 10.

For small changes (e.g. fix typo, add route): Sections 5, 7, 9 suffice.
For feature work: Sections 2, 4, 6, 8, 11 are essential.

---

## 13. Scripts

```bash
# Web
yarn install
yarn start    # dev server
yarn build    # production build

# Mobile
cd mobile && npm install
npm run ios
npm run android
npm run web   # Expo web
```

---

## 14. Documentation References

- `README.md` – Features, setup, learning path
- `PROJECT_SUMMARY.md` – Architecture, design system, deployment
- `mobile/APP_STORE_SETUP.md` – App Store setup
