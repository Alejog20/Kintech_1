import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Google Login Button Component
const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Redirect to the backend endpoint that starts the Google OAuth flow
    window.location.href = 'http://localhost:5000/api/auth/google/login';
  };

  return (
    <button onClick={handleGoogleLogin} className="submit-btn" style={{ marginTop: '1rem', backgroundColor: '#4285F4' }}>
      Login with Google
    </button>
  );
};


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.access_token);
        navigate('/'); // Redirect to home page after login
      } else {
        setError(data.error || 'Failed to log in');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="contact-form-section" style={{ maxWidth: '500px', margin: 'auto' }}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Login</button>
        </form>
        <div style={{ textAlign: 'center', margin: '1rem 0' }}>OR</div>
        <GoogleLoginButton />
      </div>
    </div>
  );
}

export default LoginPage;
