# Variance - Professional Blackjack Training Platform

A comprehensive web application for aspiring card counters and blackjack enthusiasts. Master basic strategy, learn the Hi-Lo counting system, practice deviations, and track your real-world casino performance.

![Variance Blackjack Trainer](fed-portfolio.png)

## 🎯 Features

### 📚 Learning Modules
- **Blackjack Basics** - Complete guide to blackjack rules and basic strategy
- **Card Counting Guide** - Learn the Hi-Lo system with interactive tutorials
- **Advanced Techniques** - Shuffle tracking, ace sequencing, wonging, and more
- **Bankroll Management** - Calculators and guidelines for proper bankroll sizing

### 🎮 Interactive Simulations
- **Basic Blackjack Simulation** - Practice basic strategy with instant feedback
- **Hi-Lo Counting Practice** - Real-time counting with accuracy tracking
- **Split & Double Simulation** - Master advanced plays
- **Basic Strategy Simulation** - Full game with correctness checking
- **Deviations Practice** - Focus on the Illustrious 18
- **Unified Simulation** - Complete training with customizable settings:
  - Practice modes (Full game, Basic strategy, Deviations, Soft/Hard hands, Pairs, Doubling)
  - Adjustable deck count (1-8 decks)
  - Configurable penetration (50%-90%)
  - Animation speed controls
  - Card counting with running/true count
  - Count accuracy tracking

### 🚀 Training Tools
- **Card Speed Drill** - Build counting speed with rapid card flashes
- **Deviation Flashcards** - Interactive study cards for the Illustrious 18
- **Strategy Tables** - Reference guides for perfect play

### 📊 Dashboard & Tracking (Firebase-powered)
- **User Authentication** - Secure sign-in/sign-up system
- **Casino Session Tracking** - Log real casino sessions with:
  - Date, casino name, hours played
  - Starting/ending bankroll
  - Profit/loss calculation
  - Hands played
  - Session notes
- **Performance Analytics** - Visual graphs of bankroll over time
- **Bankroll Management** - Track your card counting investment
- **Session History** - View all past casino sessions

### 🎨 User Experience
- **Dark Mode** - Easy on the eyes during long practice sessions
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI** - Clean, intuitive interface
- **Smooth Animations** - Professional transitions and effects

## 🚀 Setup

### Prerequisites
- Node.js (v14 or higher)
- Yarn package manager
- Firebase account (for authentication and session tracking)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd variance
```

2. **Install dependencies**
```bash
yarn install
```

3. **Configure Firebase**
   - Follow the detailed instructions in [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
   - Create a Firebase project
   - Enable Email/Password authentication
   - Set up Firestore database
   - Update `src/firebase/config.ts` with your Firebase credentials

4. **Start the development server**
```bash
yarn start
```

The application will open in your browser at `http://localhost:3000`

5. **Build for production**
```bash
yarn build
```

## 📁 Project Structure

```
variance/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Auth/           # Authentication forms
│   │   ├── Header/         # Navigation header
│   │   ├── CollapsibleSection/
│   │   ├── BlackjackSimulation/
│   │   ├── BasicStrategySimulation/
│   │   ├── SplitDoubleSimulation/
│   │   ├── DeviationsSimulation/
│   │   ├── UnifiedSimulation/
│   │   ├── CardSpeedDrill/
│   │   ├── DeviationFlashcards/
│   │   └── ...
│   ├── views/              # Page components
│   │   ├── BlackjackBasics/
│   │   ├── CardCountingBasics/
│   │   ├── SimulationPractice/
│   │   ├── BankrollManagement/
│   │   ├── AdvancedTechniques/
│   │   ├── Dashboard/
│   │   └── App/
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx
│   ├── firebase/           # Firebase configuration
│   │   └── config.ts
│   └── index.tsx           # Application entry point
├── public/                 # Static assets
├── FIREBASE_SETUP.md      # Firebase setup instructions
└── package.json
```

## 🔥 Firebase Integration

The application uses Firebase for:
- **Authentication** - Email/password user accounts
- **Firestore** - NoSQL database for:
  - User statistics (total bankroll, profit, sessions, hours)
  - Casino session history
  - High scores (future feature)

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for complete setup instructions.

## 🎓 Learning Path

### Beginner
1. Start with **Blackjack Basics** to understand the game
2. Study the **Strategy Tables** until you can make decisions without thinking
3. Practice with **Basic Strategy Simulation** until you reach 95%+ accuracy

### Intermediate
4. Learn **Card Counting** with the Hi-Lo system
5. Use the **Card Speed Drill** to build counting speed
6. Practice **Hi-Lo Counting** simulation to maintain count while playing

### Advanced
7. Memorize the **Illustrious 18** using the flashcards
8. Practice **Deviations Simulation** to apply count-based plays
9. Use **Unified Simulation** with all features enabled
10. Study **Advanced Techniques** for additional edges

### Professional
11. Track real casino sessions in the **Dashboard**
12. Monitor your performance and bankroll over time
13. Adjust your betting strategy based on variance and results

## 🎮 Simulation Features

All simulations include:
- ✅ Accurate blackjack rules (dealer hits soft 17, etc.)
- ✅ Realistic shoe mechanics (1-8 decks, configurable penetration)
- ✅ Running count and true count tracking (multi-deck games)
- ✅ Accuracy statistics
- ✅ Adjustable animation speeds
- ✅ Dark mode support

## 🛠️ Technologies Used

- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **React Router** - Navigation
- **Firebase** - Authentication & database
- **Recharts** - Data visualization
- **Webpack** - Module bundler

## ⚠️ Disclaimer

This application is for **educational purposes only**. Card counting is a legal strategy but casinos reserve the right to refuse service to players they suspect of counting cards. 

- Practice responsibly
- Understand the risks
- Never bet more than you can afford to lose
- Gambling should be entertainment, not income
- This tool does not guarantee profits

## 📜 License

This project is for educational use.

## 🤝 Contributing

Feel free to submit issues or pull requests to improve the platform!

## 📞 Support

If you encounter any issues or have questions:
1. Check [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for Firebase configuration help
2. Review the troubleshooting section
3. Open an issue on GitHub

---

**Good luck at the tables! 🃏**
