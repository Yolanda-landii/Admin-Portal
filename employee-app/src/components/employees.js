import React from 'react';
// import './EmployeeCard.css';

function EmployeeCard({ employee, removeEmployee }) {
    return (
        <div className="employee-card">
            <img src={employee.image || "https://via.placeholder.com/150"} alt="Employee" />
            <h3>{employee.name} {employee.surname}</h3>
            <p>{employee.email}</p>
            <p>{employee.phone}</p>
            <button className="delete-button" onClick={removeEmployee}>Delete</button>
        </div>
    );
}

export default EmployeeCard;
