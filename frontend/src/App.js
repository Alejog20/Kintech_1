import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext'; // Importar el proveedor de tema
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PropertyDetail from './pages/PropertyDetail';
import Contact from './pages/Contact';
import About from './pages/About';

function App() {
  return (
    // Envolver la aplicación con ambos proveedores.
    <ThemeProvider>
      <LanguageProvider>  
        <Router>
          <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <Footer /> 
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
