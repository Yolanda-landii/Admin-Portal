import React, { useState } from 'react';
import EmployeeCard from './employees';
// import './EmployeeList.css';

function EmployeeList({ employees, removeEmployee }) {
    const [search, setSearch] = useState('');

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(search.toLowerCase()) ||
        employee.surname.toLowerCase().includes(search.toLowerCase()) ||
        employee.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="employee-list">
            <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="employee-cards">
                {filteredEmployees.map(employee => (
                    <EmployeeCard
                        key={employee.email}
                        employee={employee}
                        removeEmployee={removeEmployee}
                    />
                ))}
            </div>
        </div>
    );
}

export default EmployeeList;
