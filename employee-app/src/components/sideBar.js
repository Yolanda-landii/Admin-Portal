import React from 'react';
// import './Sidebar.css';

function Sidebar({ setShowAddForm }) {
  return (
    <div className="sidebar">
      <h2>Admin Portal</h2>
      <ul>
        <li><a href="#dashboard">Dashboard</a></li>
        <li><a href="#attendance">Attendance</a></li>
        <li><a href="#calendar">Calendar</a></li>
        <li><a href="#leave">Leave</a></li>
        <li><a href="#posts">Posts</a></li>
        <li><a href="#employees">Employees</a></li>
        <li><a href="#reports">Reports</a></li>
        <li><a href="#configuration">Configuration</a></li>
      </ul>
      <button className="add-button" onClick={() => setShowAddForm(true)}>+ Add New Employee</button>
    </div>
  );
}

export default Sidebar;
