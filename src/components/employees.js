import React from 'react';

function EmployeeCard({ employee, removeEmployee, handleEditEmployee }) {
  return (
    <div className="employee-card">
      <img src={employee.image} alt={`${employee.name} ${employee.surname}`} className="employee-image" />
      <div className="employee-details">
        <h3>{employee.name} {employee.surname}</h3>
        <p>ID: {employee.idNumber}</p>
        <p>Email: {employee.email}</p>
        <p>Phone: {employee.phone}</p>
        <p>Role: {employee.role}</p>
        <button onClick={() => handleEditEmployee(employee)}>Edit</button>
        <button onClick={() => removeEmployee(employee.email)}>Delete</button>
      </div>
    </div>
  );
}

export default EmployeeCard;
