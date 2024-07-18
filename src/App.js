import React, { useState, useEffect } from 'react';
import Sidebar from './components/sideBar';
import EmployeeList from './components/addEmployeeList';
import AddEmployeeForm from './components/employeeForm'; 
import './App.css';

function App() {
    const [employees, setEmployees] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        role: '',
        startDate: '',
        image: ''
    });
    const [showEmployeesList, setShowEmployeesList] = useState(false);

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
        setFormData({
            name: '',
            surname: '',
            email: '',
            phone: '',
            role: '',
            startDate: '',
            image: ''
        });
        setShowEmployeesList(true); // Show employee list after adding
    };

    const removeEmployee = (email) => {
        const filteredEmployees = employees.filter(employee => employee.email !== email);
        setEmployees(filteredEmployees);
        localStorage.setItem('employees', JSON.stringify(filteredEmployees));
    };

    const updateEmployee = (updatedEmployee) => {
        const updatedEmployees = employees.map(emp =>
            emp.email === updatedEmployee.email ? updatedEmployee : emp
        );
        setEmployees(updatedEmployees);
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    };

    const handleShowEmployees = () => {
        setShowEmployeesList(true);
    };

    return (
        <div className="app">
            <Sidebar setShowAddForm={setShowAddForm} showEmployees={handleShowEmployees} />
            <div className="main-content">
                {showAddForm ? (
                    <AddEmployeeForm addEmployee={addEmployee} formData={formData} setFormData={setFormData} />
                ) : showEmployeesList ? (
                    <EmployeeList employees={employees} removeEmployee={removeEmployee} updateEmployee={updateEmployee} />
                ) : (
                    <div>Welcome to Admin Portal</div>
                )}
            </div>
        </div>
    );
}

export default App;
