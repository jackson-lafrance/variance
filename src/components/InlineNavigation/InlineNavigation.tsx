import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './InlineNavigation.css';

interface Page {
  path: string;
  title: string;
}

interface NavSection {
  label: string;
  pages: Page[];
}

const sections: NavSection[] = [
  {
    label: 'Learn',
    pages: [
      { path: '/', title: 'Blackjack Basics' },
      { path: '/counting', title: 'Card Counting' },
      { path: '/advanced', title: 'Advanced Techniques' },
      { path: '/bankroll', title: 'Bankroll Management' },
    ],
  },
  {
    label: 'Practice',
    pages: [
      { path: '/simulations', title: 'Simulations' },
      { path: '/betting', title: 'Betting Calculator' },
      { path: '/risk', title: 'Risk Calculator' },
      { path: '/progress', title: 'Progress Tracking' },
    ],
  },
];

const allPages = sections.flatMap((s) => s.pages);

export default function InlineNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const currentPage = allPages.find((p) => p.path === location.pathname);
  const specialTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/auth': 'Sign In',
    '/settings': 'Settings',
  };
  const currentTitle =
    specialTitles[location.pathname] ?? currentPage?.title ?? 'Blackjack Basics';

  const isDashboard = location.pathname === '/dashboard';
  const isSettings = location.pathname === '/settings';
  const isAuth = location.pathname === '/auth';

  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleSectionEnter = useCallback((label: string) => {
    setOpenSections((prev) => new Set(prev).add(label));
  }, []);

  const handleNavLeave = useCallback(() => {
    setOpenSections(new Set());
  }, []);

  return (
    <div className="inline-navigation" onMouseLeave={handleNavLeave}>
      <h1 className="nav-title">{currentTitle}</h1>
      <div className="nav-dropdown">
        {sections.map((section) => {
          const visiblePages = section.pages.filter(
            (p) => p.path !== location.pathname
          );
          if (visiblePages.length === 0) return null;

          const isOpen = openSections.has(section.label);

          return (
            <div key={section.label} className="nav-section" onMouseEnter={() => handleSectionEnter(section.label)}>
              <div className="nav-section-header">{section.label}</div>
              <div className={`nav-section-items ${isOpen ? 'open' : ''}`}>
                {visiblePages.map((page) => (
                  <div
                    key={page.path}
                    className="nav-dropdown-item"
                    onClick={() => handleNavigate(page.path)}
                  >
                    {page.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {currentUser && !isDashboard && (
          <div className="nav-section">
            <div
              className="nav-dropdown-item auth-item"
              onClick={() => handleNavigate('/dashboard')}
            >
              Dashboard
            </div>
          </div>
        )}
        {currentUser && !isSettings && (
          <div className="nav-section">
            <div
              className="nav-dropdown-item auth-item"
              onClick={() => handleNavigate('/settings')}
            >
              Settings
            </div>
          </div>
        )}
        {!isAuth && !currentUser && (
          <div className="nav-section">
            <div
              className="nav-dropdown-item auth-item"
              onClick={() => handleNavigate('/auth')}
            >
              Sign In
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
