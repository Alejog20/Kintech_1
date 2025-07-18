import React, { createContext, useState, useEffect, useContext } from 'react';

// Función para detectar la preferencia del sistema
const getInitialTheme = () => {
  // 1. Revisar si hay algo guardado en localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  // 2. Si no, revisar la preferencia del sistema operativo
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  // 3. Por defecto, usar el modo claro
  return 'light';
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Este useEffect es crucial. Se ejecuta cada vez que el 'theme' cambia.
  useEffect(() => {
    // 1. Limpiamos clases anteriores para evitar conflictos
    document.body.classList.remove('light-mode', 'dark-mode');
    
    // 2. Añadimos la clase correcta al <body>
    document.body.classList.add(`${theme}-mode`);
    
    // 3. Guardamos la elección del usuario en localStorage
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error("No se pudo guardar el tema en localStorage.", error);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};