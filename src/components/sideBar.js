import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pages/Pages.css';

const Sidebar = ({ setShowAddForm, handleLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  const handleNavigation = (section) => {
    setActiveSection(section);
    
    if (section === 'add-employee') {
      setShowAddForm(true);
    } else if (section === 'employee-list') {
      setShowAddForm(false);
    } else if (section === 'dashboard') {
      setShowAddForm(false);
    }
  };

  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      handleLogout();
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <i className="fas fa-code"></i>
          <h2>Software Dev Admin</h2>
        </div>
      </div>
      
      <div className="sidebar-user">
        <div className="user-avatar">
          <i className="fas fa-user-circle"></i>
        </div>
        <div className="user-info">
          <h3>Admin User</h3>
          <p>Administrator</p>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li className={activeSection === 'dashboard' ? 'active' : ''}>
            <button onClick={() => handleNavigation('dashboard')}>
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </button>
          </li>
          <li className={activeSection === 'employee-list' ? 'active' : ''}>
            <button onClick={() => handleNavigation('employee-list')}>
              <i className="fas fa-users"></i>
              <span>Employee List</span>
            </button>
          </li>
          <li className={activeSection === 'add-employee' ? 'active' : ''}>
            <button onClick={() => handleNavigation('add-employee')}>
              <i className="fas fa-user-plus"></i>
              <span>Add Employee</span>
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/')}>
              <i className="fas fa-home"></i>
              <span>Back to Home</span>
            </button>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={handleLogoutClick} className="logout-button">
          <i className="fas fa-sign-out-alt"></i>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
