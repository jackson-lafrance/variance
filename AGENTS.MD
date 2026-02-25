# AGENTS.MD

Agent onboarding and context map for the Variance codebase (web + mobile).

This file is designed to reduce time-to-context for new coding agents and make edits safer by pointing directly to the right files and constraints.

---

## 1) Project at a glance

Variance is a blackjack training product with two clients in one repository:

- **Web app**: React + TypeScript + Webpack (`/src`, root package)
- **Mobile app**: React Native + Expo (`/mobile`)
- **Backend services**: Firebase Auth + Firestore (shared between web and mobile)

Key product areas:

- Learning guides (blackjack basics, card counting, bankroll, advanced techniques)
- Practice simulations and drills
- User dashboard and progress tracking
- Betting and risk calculators

---

## 2) Repo map (high signal)

### Root (web + shared infra)

- `package.json` - web scripts/deps
- `webpack.common.js`, `webpack.dev.js`, `webpack.prod.js` - web build config
- `tsconfig.json` - web TS config (`strict: false`)
- `src/index.tsx` - web entrypoint/providers
- `src/views/App/App.tsx` - web route map
- `src/firebase/config.ts` - web Firebase init
- `src/contexts/AuthContext.tsx` - web auth state/actions
- `src/components/*` - reusable web components/simulators
- `src/views/*` - route-level web pages
- `src/utils/*` - calculators + Firestore helper modules
- `src/data/strategyTables.ts` - strategy table data
- `firestore.rules` - Firestore security rules
- `firebase.json`, `.firebaserc` - Firebase hosting/project config

### Mobile

- `mobile/package.json` - mobile scripts/deps
- `mobile/App.tsx` - provider composition
- `mobile/index.ts` - Expo root registration
- `mobile/src/navigation/AppNavigator.tsx` - auth-gated navigation stack
- `mobile/src/services/firebase.ts` - mobile Firebase init
- `mobile/src/services/AuthContext.tsx` - mobile auth context
- `mobile/src/contexts/DarkModeContext.tsx` - mobile theme context + AsyncStorage
- `mobile/src/screens/*` - route-level screens
- `mobile/src/components/*` - mobile simulation components
- `mobile/src/utils/*` - mobile calculators + Firestore helpers
- `mobile/src/data/strategyTables.ts` - mobile strategy data
- `mobile/metro.config.js` - Metro resolver hardening (blocks parent `node_modules` + react-router)
- `mobile/eas.json`, `mobile/app.json` - Expo/EAS build config

---

## 3) Quick start commands

### Web

```bash
npm install
npm start
npm run build
```

Notes:

- `npm start` runs webpack-dev-server via `webpack.dev.js`
- `npm run build` outputs to `dist/`
- Test script is a placeholder (`npm test` exits with error by design)

### Mobile

```bash
cd mobile
npm install
npm start
npm run ios
# or
npm run android
```

### Firebase deploy (manual)

```bash
firebase deploy --only hosting
firebase deploy --only firestore:rules
```

---

## 4) 5-minute onboarding path (recommended)

When starting a task, read in this order:

1. `README.md`
2. `PROJECT_SUMMARY.md`
3. `package.json` and `mobile/package.json`
4. `src/index.tsx` and `src/views/App/App.tsx`
5. `mobile/App.tsx` and `mobile/src/navigation/AppNavigator.tsx`
6. `src/firebase/config.ts` and `mobile/src/services/firebase.ts`
7. Relevant feature files (view/screen + component + util)

This gets you to productive context quickly without reading the whole tree.

---

## 5) Architecture and flow

### Web flow

- `src/index.tsx` provider chain:
  - `ErrorBoundary` -> `BrowserRouter` -> `AuthProvider` -> `ToastProvider` -> `App`
- `src/views/App/App.tsx` defines route -> view mapping.
- Most route components render `Header` directly (there is no single global layout wrapper in `App.tsx`).
- Auth-sensitive pages (`Dashboard`, `Settings`, `ProgressTracking`) enforce access inside the page component.

### Mobile flow

- `mobile/App.tsx` provider chain:
  - `DarkModeProvider` -> `AuthProvider` -> `RootNavigator`
- `mobile/src/navigation/AppNavigator.tsx` switches between:
  - unauthenticated stack (`Auth`)
  - authenticated app stack (all screens)

### Shared app behavior

- Firestore stores stats, sessions, settings, practice sessions, and high scores.
- Simulations write progress via helper modules (`practiceSessions.ts`, `highScores.ts`).

---

## 6) Route/screen map

### Web routes (`src/views/App/App.tsx`)

- `/` -> `BlackjackBasics`
- `/counting` -> `CardCountingBasics`
- `/simulations` -> `SimulationPractice`
- `/bankroll` -> `BankrollManagement`
- `/advanced` -> `AdvancedTechniques`
- `/dashboard` -> `Dashboard`
- `/settings` -> `Settings`
- `/progress` -> `ProgressTracking`
- `/betting` -> `BettingCalculator`
- `/risk` -> `RiskCalculator`
- `/privacy` -> `PrivacyPolicy`
- `/terms` -> `TermsOfService`
- `/auth` -> `Auth`

### Mobile screens (`mobile/src/navigation/AppNavigator.tsx`)

- `Home`
- `StartCardCounting`
- `BlackjackBasics`
- `CardCounting`
- `Simulations`
- `BankrollManagement`
- `AdvancedTechniques`
- `Dashboard`
- `Settings`
- `ProgressTracking`
- `BettingCalculator`
- `RiskCalculator`
- `PrivacyPolicy`
- `TermsOfService`

---

## 7) Data model and Firebase collections

Backed by `firestore.rules` user isolation rules.

Primary collections:

- `userStats` (per-user aggregate dashboard stats)
- `userSettings` (per-user preferences/settings)
- `casinoSessions` (session-by-session gambling logs)
- `practiceSessions` (simulation practice logs)
- `highScores` (simulation score leaderboard per user)
- `goals` (goal tracking; utility exists in web)

Security profile:

- Auth required
- Users only read/write their own records (`userId == request.auth.uid`)

---

## 8) "Change X -> edit Y" matrix

- **Add/modify web route** -> `src/views/App/App.tsx`, relevant `src/views/*`
- **Change web navigation labels/sections** -> `src/components/InlineNavigation/InlineNavigation.tsx`
- **Change web auth behavior** -> `src/contexts/AuthContext.tsx`, `src/components/Auth/Auth.tsx`
- **Change web dashboard Firestore logic** -> `src/views/Dashboard/Dashboard.tsx`, `src/utils/dashboardUtils.ts`
- **Change web progress/high scores logic** -> `src/views/ProgressTracking/ProgressTracking.tsx`, `src/utils/practiceSessions.ts`, `src/utils/highScores.ts`
- **Change web simulation rules/gameplay** -> relevant component in `src/components/*Simulation*`
- **Change unified simulation modes/settings logic** -> `src/views/SimulationPractice/SimulationPractice.tsx`, `src/components/UnifiedSimulation/UnifiedSimulation.tsx`
- **Change web betting/risk formulas** -> `src/utils/bettingCalculator.ts`, `src/utils/riskCalculator.ts`
- **Change mobile navigation/auth gating** -> `mobile/src/navigation/AppNavigator.tsx`
- **Change mobile auth logic** -> `mobile/src/services/AuthContext.tsx`, `mobile/src/screens/Auth.tsx`
- **Change mobile dashboard/settings firestore usage** -> `mobile/src/screens/Dashboard.tsx`, `mobile/src/screens/Settings.tsx`
- **Change mobile simulations** -> `mobile/src/screens/SimulationPractice.tsx`, `mobile/src/components/*Simulation*.tsx`
- **Change mobile dark mode behavior** -> `mobile/src/contexts/DarkModeContext.tsx`, consuming screens
- **Change Firebase init/env handling** -> `src/firebase/config.ts`, `mobile/src/services/firebase.ts`
- **Change Firestore permissions** -> `firestore.rules`
- **Change web build pipeline** -> `webpack.*.js`
- **Change mobile bundling behavior** -> `mobile/metro.config.js`

---

## 9) Known gotchas (read before editing)

1. **Env variable naming**:
   - Web uses `VITE_*` keys but build system is webpack (not Vite).
2. **Firebase config fallbacks**:
   - Both web and mobile Firebase configs include hardcoded fallback values.
3. **No real automated tests**:
   - Root `test` script is placeholder.
4. **Firestore query index fallback behavior**:
   - Some helpers catch `failed-precondition` and return empty arrays (can hide index issues).
5. **TypeScript strictness differs**:
   - Web: `strict: false`; mobile: strict mode enabled.
6. **Mobile module resolution constraints**:
   - `mobile/metro.config.js` aggressively blocks parent `node_modules` and react-router packages.
7. **Simulation score bucketing detail**:
   - Some simulation components write scores under `SimulationTypes.UNIFIED` (intentional grouping in current implementation).
8. **Unused goals utility (web)**:
   - `src/utils/goals.ts` exists but is not currently wired into views.
9. **Package manager artifacts are mixed**:
   - Root contains both `package-lock.json` and `yarn.lock`; prefer `npm` unless a task explicitly requires yarn.
10. **No CI workflow files are present**:
   - No `.github/workflows/*`; run local verification for changes.

---

## 10) Environment variables

### Web (`.env` at repo root, consumed by webpack DefinePlugin)

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

### Mobile (Expo public env vars)

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID`

---

## 11) Efficient context-gathering workflow for agents

Before coding:

1. Identify target surface: web, mobile, or shared.
2. Open entrypoint + route file for that surface.
3. Open the specific view/screen.
4. Open the reusable component(s) used by that screen.
5. Open any util/firestore helper imported by those components.
6. Confirm data writes/reads and collection names before changing logic.

Suggested ripgrep queries:

```bash
rg "export default function" src/views mobile/src/screens
rg "SimulationTypes\\." src/components mobile/src/components
rg "collection\\(|doc\\(|setDoc\\(|addDoc\\(" src mobile/src
rg "useAuth\\(|useDarkMode\\(" src mobile/src
```

---

## 12) Validation checklist (per change)

- Run the relevant app locally:
  - web: `npm start`
  - mobile: `cd mobile && npm start` (plus iOS/Android target if needed)
- If Firestore logic changed, verify:
  - authenticated read/write paths
  - collection names unchanged unless intentional
  - fallback/error behavior still acceptable
- If navigation changed, verify route/screen registration and links/buttons.
- If calculator logic changed, test at least one known input/output case manually.

---

## 13) Primary file reading lists

### Web deep-dive (ordered)

1. `src/index.tsx`
2. `src/views/App/App.tsx`
3. `src/components/Header/Header.tsx`
4. `src/components/InlineNavigation/InlineNavigation.tsx`
5. `src/contexts/AuthContext.tsx`
6. `src/firebase/config.ts`
7. `src/views/Dashboard/Dashboard.tsx`
8. `src/views/ProgressTracking/ProgressTracking.tsx`
9. `src/views/SimulationPractice/SimulationPractice.tsx`
10. `src/components/UnifiedSimulation/UnifiedSimulation.tsx`
11. `src/utils/practiceSessions.ts`
12. `src/utils/highScores.ts`
13. `src/utils/bettingCalculator.ts`
14. `src/utils/riskCalculator.ts`

### Mobile deep-dive (ordered)

1. `mobile/App.tsx`
2. `mobile/src/navigation/AppNavigator.tsx`
3. `mobile/src/services/AuthContext.tsx`
4. `mobile/src/services/firebase.ts`
5. `mobile/src/screens/Home.tsx`
6. `mobile/src/screens/SimulationPractice.tsx`
7. `mobile/src/screens/Dashboard.tsx`
8. `mobile/src/screens/ProgressTracking.tsx`
9. `mobile/src/screens/Settings.tsx`
10. `mobile/src/components/BasicStrategySimulation.tsx`
11. `mobile/src/components/BasicHiLoSimulation.tsx`
12. `mobile/src/utils/practiceSessions.ts`
13. `mobile/src/utils/highScores.ts`
14. `mobile/metro.config.js`

---

If you add new top-level architecture, collections, or major flows, update this file in the same PR so future agents stay fast and accurate.
