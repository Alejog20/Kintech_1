import React from 'react';

function DarkModeToggle({ isDarkMode, toggleDarkMode }) {
  return (
    <button 
      className="dark-mode-toggle"
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <span className="toggle-icon">
        {isDarkMode ? '☀️' : '🌙'}
      </span>
      <span className="toggle-text">
        {isDarkMode ? 'Claro' : 'Oscuro'}
      </span>
    </button>
  );
}

export default DarkModeToggle;

