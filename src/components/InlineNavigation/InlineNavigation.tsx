import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './InlineNavigation.css';

interface Page {
  path: string;
  title: string;
}

const pages: Page[] = [
  { path: '/', title: 'Blackjack Basics' },
  { path: '/counting', title: 'Card Counting' },
  { path: '/simulations', title: 'Simulations' },
  { path: '/bankroll', title: 'Bankroll Management' },
  { path: '/advanced', title: 'Advanced Techniques' },
  { path: '/progress', title: 'Progress Tracking' },
  { path: '/betting', title: 'Betting Calculator' },
  { path: '/risk', title: 'Risk Calculator' },
  { path: '/settings', title: 'Settings' },
];

export default function InlineNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const currentPage = pages.find(page => page.path === location.pathname);
  const isDashboard = location.pathname === '/dashboard';
  const isAuth = location.pathname === '/auth';
  const isSettings = location.pathname === '/settings';
  const isProgress = location.pathname === '/progress';
  const isBetting = location.pathname === '/betting';
  const isRisk = location.pathname === '/risk';
  const currentTitle = isDashboard ? 'Dashboard' 
    : isAuth ? 'Sign In' 
    : isSettings ? 'Settings'
    : isProgress ? 'Progress Tracking'
    : isBetting ? 'Betting Calculator'
    : isRisk ? 'Risk Calculator'
    : (currentPage ? currentPage.title : 'Blackjack Basics');

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const otherPages = pages.filter(page => page.path !== location.pathname);

  return (
    <div className="inline-navigation">
      <h1 className="nav-title">{currentTitle}</h1>
      <div className="nav-dropdown">
        {otherPages.map((page) => (
          <div
            key={page.path}
            className="nav-dropdown-item"
            onClick={() => handleNavigate(page.path)}
          >
            {page.title}
          </div>
        ))}
        {!isDashboard && currentUser && (
          <div
            className="nav-dropdown-item auth-item"
            onClick={() => handleNavigate('/dashboard')}
          >
            Dashboard
          </div>
        )}
        {!isAuth && !currentUser && (
          <div
            className="nav-dropdown-item auth-item"
            onClick={() => handleNavigate('/auth')}
          >
            Sign In
          </div>
        )}
        {currentUser && !isSettings && (
          <div
            className="nav-dropdown-item auth-item"
            onClick={() => handleNavigate('/settings')}
          >
            Settings
          </div>
        )}
        {!currentUser && !isAuth && (
          <div
            className="nav-dropdown-item auth-item"
            onClick={() => handleNavigate('/auth')}
          >
            Sign In
          </div>
        )}
      </div>
    </div>
  );
}
