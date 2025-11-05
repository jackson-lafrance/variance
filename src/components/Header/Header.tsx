import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import InlineNavigation from '../InlineNavigation';
import DarkModeToggle from '../DarkModeToggle';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const isAuth = location.pathname === '/auth';
  const isDashboard = location.pathname === '/dashboard';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="page-header-wrapper">
      <div className="header">
        <InlineNavigation />
        <div className="header-actions">
          {!isAuth && !currentUser && (
            <button
              className="header-action-button"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </button>
          )}
          {currentUser && (
            <button
              className="header-action-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
          <DarkModeToggle />
        </div>
      </div>
    </div>
  );
}
