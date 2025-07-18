import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext'; // 1. Importar el proveedor

/**
 * 🚀 React Application Entry Point
 * * La corrección clave es envolver el componente <App /> con <ThemeProvider />.
 * Esto "provee" el contexto del tema a toda la aplicación.
 */

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. Envolver la App con el ThemeProvider */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
