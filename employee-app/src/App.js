import React, { useState, useEffect } from 'react';
import Sidebar from './components/sideBar';
import EmployeeList from './components/addEmployeeList';
import AddEmployeeForm from './components/employeeForm';
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

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        {showAddForm ? (
          <AddEmployeeForm addEmployee={addEmployee} formData={formData} setFormData={setFormData} />
        ) : (
          <EmployeeList employees={employees} removeEmployee={removeEmployee} />
        )}
        <button className="add-button" onClick={() => setShowAddForm(true)}>+ Add New Employee</button>
      </div>
    </div>
  );
}

export default App;
