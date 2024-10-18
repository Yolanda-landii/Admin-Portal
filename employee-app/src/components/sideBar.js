import React from 'react';


const Sidebar = ({ setShowAddForm, handleLogout }) => {
  return (
    <div className="sidebar">
      <h2>Employee Dashboard</h2>
      <button onClick={() => setShowAddForm(true)}>Add New Employee</button>
      <button onClick={handleLogout}>Sign Out</button>
    </div>
  );
};

export default Sidebar;
