import React, { useState } from 'react';
import EmployeeCard from './employees';

function EmployeeList({ employees, removeEmployee, updateEmployee }) {
    const [search, setSearch] = useState('');

    const filteredEmployees = employees.filter(employee =>
        (employee.name && employee.name.toLowerCase().includes(search.toLowerCase())) ||
        (employee.surname && employee.surname.toLowerCase().includes(search.toLowerCase())) ||
        (employee.email && employee.email.toLowerCase().includes(search.toLowerCase()))
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
                        updateEmployee={updateEmployee} 
                    />
                ))}
            </div>
        </div>
    );
}

export default EmployeeList;
