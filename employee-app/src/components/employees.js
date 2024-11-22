import React from 'react';
// import './employeeCard.css';

function EmployeeCard({ employee, removeEmployee }) {
    return (
        <div className="employee-card">
            <img src={employee.image || "https://via.placeholder.com/150"} alt="Employee" />
            <div className="employee-details">
                <h3>{employee.name} {employee.surname}</h3>
                <p>{employee.email}</p>
                <p>{employee.phone}</p>
            </div>
            <button className="delete-button" onClick={() => removeEmployee(employee.email)}>Delete</button>
        </div>
    );
}

export default EmployeeCard;
