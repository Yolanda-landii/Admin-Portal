import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">Welcome to Software Dev Admin Portal</h1>
        <p className="landing-subtitle">Streamline your software development team management with our comprehensive admin solution</p>
        
        <div className="landing-features">
          <div className="feature-card">
            <i className="fas fa-users"></i>
            <h3>Employee Management</h3>
            <p>Easily manage your development team, roles, and responsibilities</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-chart-line"></i>
            <h3>Performance Tracking</h3>
            <p>Monitor and analyze developer performance metrics</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-tasks"></i>
            <h3>Project Management</h3>
            <p>Assign and track development tasks efficiently</p>
          </div>
        </div>

        <div className="landing-cta">
          <Link to="/login" className="cta-button primary">Login</Link>
          <Link to="/register" className="cta-button secondary">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Landing; 