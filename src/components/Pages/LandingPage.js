import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">Employee Management System</h1>
        <p className="landing-subtitle">
          A comprehensive solution for managing your organization's employees
        </p>
        
        <div className="landing-features">
          <div className="feature-card">
            <i className="fas fa-chart-line"></i>
            <h3>Dashboard Analytics</h3>
            <p>Get insights into your workforce with detailed statistics and metrics</p>
          </div>
          
          <div className="feature-card">
            <i className="fas fa-users"></i>
            <h3>Employee Management</h3>
            <p>Easily add, edit, and manage employee information in one place</p>
          </div>
          
          <div className="feature-card">
            <i className="fas fa-search"></i>
            <h3>Search & Filter</h3>
            <p>Quickly find employees with powerful search and filtering capabilities</p>
          </div>
        </div>
        
        <div className="landing-cta">
          <Link to="/dashboard" className="cta-button primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage; 