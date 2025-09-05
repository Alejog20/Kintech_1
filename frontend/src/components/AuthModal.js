import React, { useState, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import './AuthModal.css';

const GoogleLoginButton = ({ onError }) => {
  const handleGoogleLogin = () => {
    try {
      window.location.href = 'http://localhost:5000/api/auth/google/login';
    } catch (error) {
      onError('Google login failed');
    }
  };

  return (
    <button 
      onClick={handleGoogleLogin} 
      className="google-btn"
      type="button"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" className="google-icon">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Continue with Google
    </button>
  );
};

function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { language } = useContext(LanguageContext);
  const { login } = useAuth();

  const translations = {
    es: {
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      name: 'Nombre',
      loginButton: 'Iniciar Sesión',
      registerButton: 'Registrarse',
      or: 'O',
      alreadyHaveAccount: '¿Ya tienes una cuenta?',
      noAccount: '¿No tienes cuenta?',
      switchToLogin: 'Inicia sesión aquí',
      switchToRegister: 'Regístrate aquí',
      close: 'Cerrar',
      loginError: 'Error al iniciar sesión',
      registerError: 'Error al registrarse',
      registerSuccess: '¡Registro exitoso! Ahora puedes iniciar sesión.',
      requiredField: 'Este campo es obligatorio',
      invalidEmail: 'Por favor ingresa un email válido',
      passwordLength: 'La contraseña debe tener al menos 6 caracteres'
    },
    en: {
      login: 'Login',
      register: 'Sign Up',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      loginButton: 'Sign In',
      registerButton: 'Sign Up',
      or: 'OR',
      alreadyHaveAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
      switchToLogin: 'Sign in here',
      switchToRegister: 'Sign up here',
      close: 'Close',
      loginError: 'Login failed',
      registerError: 'Registration failed',
      registerSuccess: 'Registration successful! You can now sign in.',
      requiredField: 'This field is required',
      invalidEmail: 'Please enter a valid email',
      passwordLength: 'Password must be at least 6 characters long'
    }
  };

  const t = translations[language];

  const resetForm = () => {
    setLoginData({ email: '', password: '' });
    setRegisterData({ name: '', email: '', password: '' });
    setError('');
    setSuccess('');
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = (data, isLogin = false) => {
    if (!isLogin && !data.name.trim()) {
      setError(t.requiredField);
      return false;
    }
    if (!data.email.trim()) {
      setError(t.requiredField);
      return false;
    }
    if (!data.email.includes('@')) {
      setError(t.invalidEmail);
      return false;
    }
    if (!data.password || data.password.length < 6) {
      setError(t.passwordLength);
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm(loginData, true)) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.access_token);
        handleClose();
      } else {
        setError(data.error || t.loginError);
      }
    } catch (err) {
      setError(t.loginError);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!validateForm(registerData)) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(t.registerSuccess);
        setRegisterData({ name: '', email: '', password: '' });
        setTimeout(() => {
          setActiveTab('login');
          setSuccess('');
        }, 2000);
      } else {
        setError(data.error || t.registerError);
      }
    } catch (err) {
      setError(t.registerError);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={handleClose}>
          ×
        </button>
        
        <div className="auth-modal-header">
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('login');
                setError('');
                setSuccess('');
              }}
            >
              {t.login}
            </button>
            <button 
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('register');
                setError('');
                setSuccess('');
              }}
            >
              {t.register}
            </button>
          </div>
        </div>

        <div className="auth-modal-content">
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label>{t.email}</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>{t.password}</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? '...' : t.loginButton}
              </button>
              
              <div className="auth-divider">
                <span>{t.or}</span>
              </div>
              
              <GoogleLoginButton onError={setError} />
              
              <p className="auth-switch">
                {t.noAccount} <button type="button" onClick={() => setActiveTab('register')}>{t.switchToRegister}</button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="form-group">
                <label>{t.name}</label>
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>{t.email}</label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>{t.password}</label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? '...' : t.registerButton}
              </button>
              
              <div className="auth-divider">
                <span>{t.or}</span>
              </div>
              
              <GoogleLoginButton onError={setError} />
              
              <p className="auth-switch">
                {t.alreadyHaveAccount} <button type="button" onClick={() => setActiveTab('login')}>{t.switchToLogin}</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;