import React, { createContext, useState, useEffect } from 'react';

// 1. Crear el Contexto
export const LanguageContext = createContext();

// 2. Crear el Proveedor del Contexto
// Este componente envolverá toda nuestra aplicación y manejará la lógica del idioma.
export const LanguageProvider = ({ children }) => {
  // El estado se inicializa con el valor de localStorage o con 'es' por defecto.
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'es');

  // Este efecto se ejecuta cada vez que el idioma cambia para guardarlo en localStorage.
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Función para cambiar el idioma
  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'es' ? 'en' : 'es'));
  };

  // Pasamos el idioma actual y la función para cambiarlo a todos los componentes hijos.
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
