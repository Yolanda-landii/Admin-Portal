import React, { useState } from 'react';
import EmployeeCard from './employees';
// import './EmployeeList.css';

function EmployeeList({ employees, removeEmployee }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.surname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="employee-list">
            <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredEmployees.map((employee, index) => (
                <EmployeeCard key={index} employee={employee} removeEmployee={() => removeEmployee(index)} />
            ))}
        </div>
    );
}

export default EmployeeList;
