import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import Google Provider
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PropertyDetail from './pages/PropertyDetail';
import Contact from './pages/Contact';
import About from './pages/About';
import LoginCallback from './pages/LoginCallback'; // Import the new callback component

import AdminLayout from './components/AdminLayout'; // Import AdminLayout
import AdminDashboard from './pages/AdminDashboard'; // Import AdminDashboard
import AdminPropertyList from './components/AdminPropertyList'; // Import AdminPropertyList
import PropertyForm from './components/PropertyForm'; // Import PropertyForm

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />
                <main style={{ flex: 1 }}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/property/:id" element={<PropertyDetail />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login/callback" element={<LoginCallback />} /> {/* Google OAuth callback */}

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} /> {/* Default admin route */}
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="properties" element={<AdminPropertyList />} />
                      <Route path="properties/new" element={<PropertyForm />} />
                      <Route path="properties/edit/:id" element={<PropertyForm />} />
                    </Route>
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
