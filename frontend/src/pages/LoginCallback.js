import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginCallback() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      login(token);
      navigate('/'); // Redirect to home on success
    } else if (error) {
      console.error("OAuth Error:", error);
      navigate('/login'); // Redirect to login on error
    }
  }, [location, login, navigate]);

  return (
    <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
      <h2>Logging you in...</h2>
    </div>
  );
}

export default LoginCallback;
