import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle'; // Importa el nuevo componente


function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="nav-wrapper">
          <Link to="/" className="logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">Rentev by Elsa</span>
          </Link>
          
          <nav className="nav-menu">
            <Link to="/" className="nav-link">Propiedades</Link>
            <Link to="/contact" className="nav-link">Contacto</Link>
            <button className="cta-button">Iniciar Sesión</button>
            <ThemeToggle /> 
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;