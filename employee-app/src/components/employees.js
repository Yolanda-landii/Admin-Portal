import React, { useState } from 'react';
// import './EmployeeCard.css';

function EmployeeCard({ employee, removeEmployee, updateEmployee }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState({ ...employee });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedEmployee({ ...employee });
  };

  const handleSave = () => {
    updateEmployee(editedEmployee);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee({ ...editedEmployee, [name]: value });
  };

  return (
    <div className="employee-card">
      <img src={editedEmployee.image || 'default-image.jpg'} alt={editedEmployee.name} />
      <div className="employee-details">
        {isEditing ? (
          <>
            <input type="text" name="name" value={editedEmployee.name} onChange={handleChange} />
            <input type="email" name="email" value={editedEmployee.email} onChange={handleChange} />
            <input type="text" name="phone" value={editedEmployee.phone} onChange={handleChange} />
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          <>
            <h3>{editedEmployee.name}</h3>
            <p>{editedEmployee.email}</p>
            <p>{editedEmployee.phone}</p>
            <button className="edit-button" onClick={handleEdit}>Edit</button>
            <button className="delete-button" onClick={() => removeEmployee(employee.email)}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}

export default EmployeeCard;
