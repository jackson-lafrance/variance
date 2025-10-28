import React from 'react';
import InlineNavigation from '../InlineNavigation';
import DarkModeToggle from '../DarkModeToggle';
import './Header.css';

export default function Header() {
  return (
    <div className="header">
      <InlineNavigation />
      <DarkModeToggle />
    </div>
  );
}
