import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

// Este es el componente para el botón de idioma.
// Usa el 'LanguageContext' para obtener el idioma actual y la función para cambiarlo.
function LanguageToggle() {
  const { language, toggleLanguage } = useContext(LanguageContext);

  return (
    <button onClick={toggleLanguage} className="language-toggle-btn-nav">
      {language === 'es' ? 'EN' : 'ES'}
    </button>
  );
}

export default LanguageToggle;
