import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BlackjackBasics from '../BlackjackBasics';
import CardCountingBasics from '../CardCountingBasics';
import Services from '../Services';
import Portfolio from '../Portfolio';
import Contact from '../Contact';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<BlackjackBasics />} />
        <Route path="/about" element={<CardCountingBasics />} />
        <Route path="/services" element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}
