import React, { useState, useEffect } from 'react';
import './Pages.css'; 

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const response = await fetch('http://localhost:3001/api/csrf-token', {
        credentials: 'include', 
      });
      const data = await response.json();
      setCsrfToken(data.csrfToken);
    };
    
    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken, 
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setAlert({ message: 'Admin registered successfully', type: 'success' });
        setTimeout(() => {
          window.location.href = '/login'; 
        }, 2000);
      } else {
        setAlert({ message: `Error: ${data.message}`, type: 'error' });
      }
    } catch (error) {
      setAlert({ message: `Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
      setFormData({ name: '', email: '', password: '' });
    }
  };

  return (
    <div className="register">
      {alert && <div className={`alert ${alert.type}`}>{alert.message}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>Already have an account? <a href="/login">Login here</a></p> 
    </div>
  );
}

export default Register;
