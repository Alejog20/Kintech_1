import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { LanguageContext } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

function Header() {
  const { language } = useContext(LanguageContext);
  const { isAuthenticated, user, logout } = useAuth(); // Get auth state

  const navLinks = {
    es: {
      properties: 'Propiedades',
      about: 'Conócenos',
      contact: 'Contacto',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      logout: 'Cerrar Sesión'
    },
    en: {
      properties: 'Properties',
      about: 'About Us',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      logout: 'Logout'
    }
  };

  const t = navLinks[language];

  return (
    <header className="header">
      <div className="container">
        <div className="nav-wrapper">
          <Link to="/" className="logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">Rentev by Elsa</span>
          </Link>
          
          <nav className="nav-menu">
            <Link to="/" className="nav-link">{t.properties}</Link>
            <Link to="/about" className="nav-link">{t.about}</Link>
            <Link to="/contact" className="nav-link">{t.contact}</Link>
            
            {isAuthenticated ? (
              <>
                <span className="nav-link">Welcome, {user.name}!</span>
                <button onClick={logout} className="cta-button">{t.logout}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">{t.login}</Link>
                <Link to="/register" className="cta-button">{t.register}</Link>
              </>
            )}
            
            <ThemeToggle /> 
            <LanguageToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
