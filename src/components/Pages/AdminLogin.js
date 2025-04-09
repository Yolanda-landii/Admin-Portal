import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app'; 
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'; 
import { useNavigate, Link } from 'react-router-dom'; 
import './Pages.css';

const firebaseConfig = {
  apiKey: "AIzaSyCf-fNeNHpvy_2ku3U2ZTSNpyYnk_9rMbU",
  authDomain: "node-employee-app-ff2b3.firebaseapp.com",
  projectId: "node-employee-app-ff2b3",
  storageBucket: "node-employee-app-ff2b3.appspot.com",
  messagingSenderId: "613687702649",
  appId: "1:613687702649:web:0d19204f8cb6c13610d0a8",
  measurementId: "G-2WM495WLG1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }
  
    try {
      const csrfResponse = await fetch('http://localhost:3001/api/csrf-token', {
        method: 'GET',
        credentials: 'include', 
      });
      const { csrfToken } = await csrfResponse.json();
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ idToken }),
        credentials: 'include',
      });
  
      if (response.ok) {
        navigate('/dashboard'); 
      } else {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Login failed');
      }
    } catch (error) {
      setError(error.message); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let logoutTimer;
  
    const handleLogout = async () => {
      try {
        await signOut(auth); 
        alert('You have been logged out due to inactivity');
        navigate('/login'); 
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };
  
    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(handleLogout, 300000); // 5 minutes (300,000 ms)
    };
  
    resetTimer();
  
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
  
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      clearTimeout(logoutTimer);
    };
  }, [navigate]);

  return (
    <div className="auth-container">
      <div className="login-card">
        <h1 className="title">Welcome Back</h1>
        <p className="subtitle">Please sign in to your account</p>
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email"
              className="input"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password"
              className="input"
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Register here</Link></p>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
