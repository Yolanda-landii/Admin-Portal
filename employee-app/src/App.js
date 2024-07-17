import React, { useState, useEffect } from 'react';
import Sidebar from './components/sideBar';
import EmployeeList from './components/addEmployeeList';
import AddEmployeeForm from './components/employeeForm';
import EmployeeCard from './components/employees'; 
import './App.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, []);

  const addEmployee = () => {
    const newEmployees = [...employees, formData];
    setEmployees(newEmployees);
    localStorage.setItem('employees', JSON.stringify(newEmployees));
    setShowAddForm(false);
    setFormData({});
  };

  const removeEmployee = (email) => {
    const filteredEmployees = employees.filter(employee => employee.email !== email);
    setEmployees(filteredEmployees);
    localStorage.setItem('employees', JSON.stringify(filteredEmployees));
  };

  const updateEmployee = (updatedEmployee) => {
    const updatedEmployees = employees.map(employee =>
      employee.email === updatedEmployee.email ? updatedEmployee : employee
    );
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  return (
    <div className="app">
      <Sidebar setShowAddForm={setShowAddForm} />
      <div className="main-content">
        {showAddForm ? (
          <AddEmployeeForm addEmployee={addEmployee} formData={formData} setFormData={setFormData} />
        ) : (
          <EmployeeList employees={employees} removeEmployee={removeEmployee}>
            {/* Render EmployeeCard for each employee */}
            {employees.map(employee => (
              <EmployeeCard
                key={employee.email}
                employee={employee}
                removeEmployee={removeEmployee}
                updateEmployee={updateEmployee}
              />
            ))}
          </EmployeeList>
        )}
      </div>
    </div>
  );
}

export default App;
