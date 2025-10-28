import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './InlineNavigation.css';

interface Page {
  path: string;
  title: string;
}

const pages: Page[] = [
  { path: '/', title: 'Blackjack Basics' },
  { path: '/about', title: 'Card Counting Basics' },
  { path: '/services', title: 'Services' },
  { path: '/portfolio', title: 'Portfolio' },
  { path: '/contact', title: 'Contact' },
];

export default function InlineNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = pages.find(page => page.path === location.pathname);
  const currentTitle = currentPage ? currentPage.title : 'Blackjack Basics';

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
      </div>
    </div>
  );
}
