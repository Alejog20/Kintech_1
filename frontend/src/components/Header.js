import React, { useContext } from 'react'; // Importar useContext
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle'; // 1. Importar el nuevo componente de idioma
import { LanguageContext } from '../context/LanguageContext'; // 2. Importar el contexto de idioma

function Header() {
  // 3. Usar el contexto para obtener el idioma actual
  const { language } = useContext(LanguageContext);

  // Objeto con las traducciones para los enlaces de navegación
  const navLinks = {
    es: {
      properties: 'Propiedades',
      about: 'Conócenos',
      contact: 'Contacto',
      login: 'Iniciar Sesión'
    },
    en: {
      properties: 'Properties',
      about: 'About Us',
      contact: 'Contact',
      login: 'Login'
    }
  };

  const t = navLinks[language]; // Seleccionar la traducción correcta

  return (
    <header className="header">
      <div className="container">
        <div className="nav-wrapper">
          <Link to="/" className="logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">Rentev by Elsa</span>
          </Link>
          
          <nav className="nav-menu">
            {/* 4. Usar las traducciones en los enlaces */}
            <Link to="/" className="nav-link">{t.properties}</Link>
            <Link to="/about" className="nav-link">{t.about}</Link>
            <Link to="/contact" className="nav-link">{t.contact}</Link>
            <button className="cta-button">{t.login}</button>
            
            {/* 5. Añadir los componentes de toggle */}
            <ThemeToggle /> 
            <LanguageToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
