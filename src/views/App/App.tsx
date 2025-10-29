import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BlackjackBasics from '../BlackjackBasics';
import CardCountingBasics from '../CardCountingBasics';
import SimulationPractice from '../SimulationPractice';
import BankrollManagement from '../BankrollManagement';
import AdvancedTechniques from '../AdvancedTechniques';
import Dashboard from '../Dashboard';
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
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </div>
  );
}
