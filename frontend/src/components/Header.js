import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="nav-wrapper">
          <Link to="/" className="logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">PrimeProp</span>
          </Link>
          
          <nav className="nav-menu">
            <Link to="/" className="nav-link">Properties</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <button className="cta-button">Get Started</button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;