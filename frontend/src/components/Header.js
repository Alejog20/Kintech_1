import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import AuthModal from './AuthModal';
import { LanguageContext } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

function Header() {
  const { language } = useContext(LanguageContext);
  const { isAuthenticated, user, logout, isAdmin } = useAuth(); // Get auth state and isAdmin
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

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

  const openLoginModal = () => {
    setAuthModalTab('login');
    setAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalTab('register');
    setAuthModalOpen(true);
  };

  return (
    <>
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
              
              {isAdmin && (
                <Link to="/admin/dashboard" className="nav-link">Admin Panel</Link>
              )}

              {isAuthenticated ? (
                <>
                  <span className="nav-link">Welcome, {user?.name || user?.email || 'User'}!</span>
                  <button onClick={logout} className="cta-button">{t.logout}</button>
                </>
              ) : (
                <>
                  <button onClick={openLoginModal} className="nav-link auth-btn">{t.login}</button>
                  <button onClick={openRegisterModal} className="cta-button auth-btn">{t.register}</button>
                </>
              )}
              
              <ThemeToggle /> 
              <LanguageToggle />
            </nav>
          </div>
        </div>
      </header>
      
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </>
  );
}

export default Header;
