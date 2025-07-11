import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * 🚀 React Application Entry Point
 * 
 * This file bootstraps our entire React application.
 * 
 * React 18 Concepts:
 * - createRoot: New way to render React apps (replaces ReactDOM.render)
 * - StrictMode: Helps detect problems in development
 */

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
