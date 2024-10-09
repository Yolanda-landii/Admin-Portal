import React, { useState } from 'react';
import EmployeeCard from './employees';

function EmployeeList({ employees, removeEmployee, handleEditEmployee }) {
  const [search, setSearch] = useState('');

  const filteredEmployees = employees.filter(employee =>
    (employee.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (employee.surname || '').toLowerCase().includes(search.toLowerCase()) ||
    (employee.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (employee.idNumber || '').includes(search)
  );

  return (
    <div className="employee-list">
      <input
        type="text"
        placeholder="Search by name, surname, email, or ID number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="employee-cards">
        {filteredEmployees.map(employee => (
          <EmployeeCard
            key={employee.email}
            employee={employee}
            removeEmployee={removeEmployee}
            handleEditEmployee={handleEditEmployee}
          />
        ))}
      </div>
    </div>
  );
}

export default EmployeeList;