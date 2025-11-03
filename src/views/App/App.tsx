import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BlackjackBasics from '../BlackjackBasics';
import CardCountingBasics from '../CardCountingBasics';
import SimulationPractice from '../SimulationPractice';
import BankrollManagement from '../BankrollManagement';
import AdvancedTechniques from '../AdvancedTechniques';
import Dashboard from '../Dashboard';
import Settings from '../Settings';
import ProgressTracking from '../ProgressTracking';
import BettingCalculator from '../BettingCalculator';
import RiskCalculator from '../RiskCalculator';
import PrivacyPolicy from '../PrivacyPolicy';
import TermsOfService from '../TermsOfService';
import Auth from '../../components/Auth';
import './App.css';

export default function App() {
  return (
    <div className="app">
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
    </div>
  );
}
