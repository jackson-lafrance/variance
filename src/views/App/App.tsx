import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Lazy load page components for better performance
const BlackjackBasics = lazy(() => import('../BlackjackBasics'));
const CardCountingBasics = lazy(() => import('../CardCountingBasics'));
const SimulationPractice = lazy(() => import('../SimulationPractice'));
const BankrollManagement = lazy(() => import('../BankrollManagement'));
const AdvancedTechniques = lazy(() => import('../AdvancedTechniques'));
const Dashboard = lazy(() => import('../Dashboard'));
const Settings = lazy(() => import('../Settings'));
const ProgressTracking = lazy(() => import('../ProgressTracking'));
const BettingCalculator = lazy(() => import('../BettingCalculator'));
const RiskCalculator = lazy(() => import('../RiskCalculator'));
const PrivacyPolicy = lazy(() => import('../PrivacyPolicy'));
const TermsOfService = lazy(() => import('../TermsOfService'));
const Auth = lazy(() => import('../../components/Auth'));

const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '50vh',
    color: 'var(--color-text-secondary)'
  }}>
    Loading...
  </div>
);

export default function App() {
  return (
    <div className="app">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<BlackjackBasics />} />
          <Route path="/counting" element={<CardCountingBasics />} />
          <Route path="/simulations" element={<SimulationPractice />} />
          <Route path="/bankroll" element={<BankrollManagement />} />
          <Route path="/advanced" element={<AdvancedTechniques />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/progress" element={<ProgressTracking />} />
          <Route path="/betting" element={<BettingCalculator />} />
          <Route path="/risk" element={<RiskCalculator />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Suspense>
    </div>
  );
}
