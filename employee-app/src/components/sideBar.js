import React from 'react';
// import './Sidebar.css';

function Sidebar({ setShowAddForm }) {
  return (
    <div className="sidebar">
      <h2>Admin Portal</h2>
      <ul>
        <li><a href="#dashboard">Dashboard</a></li>
        <li><a href="#employees">Employees</a></li>
      </ul>
      <button className="add-button" onClick={() => setShowAddForm(true)}>+ Add New Employee</button>
    </div>
  );
}

export default Sidebar;
