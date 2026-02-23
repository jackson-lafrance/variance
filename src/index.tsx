import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import App from './views/App';
import './styles/theme.css';

// Suppress benign Firebase abort errors that occur when components unmount
// while Firestore requests are still in-flight (e.g. route navigation).
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  if (
    reason?.name === 'AbortError' ||
    reason?.message === 'The user aborted a request.' ||
    reason?.code === 'aborted'
  ) {
    event.preventDefault();
  }
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
