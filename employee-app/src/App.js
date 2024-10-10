import React, { useState, useEffect } from 'react';
import Sidebar from './components/sideBar';
import EmployeeList from './components/addEmployeeList';
import AddEmployeeForm from './components/employeeForm';
import Loader from './components/Loader'; 
import Alert from './components/Alert';  
import './App.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editEmployeeEmail, setEditEmployeeEmail] = useState('');
  const [loading, setLoading] = useState(false);   
  const [alert, setAlert] = useState(null);      

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);  
      try {
        const response = await fetch('http://localhost:3001/api/employees');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        setAlert({ message: 'Error fetching employees', type: 'error' });
      } finally {
        setLoading(false);  
      }
    };

    fetchEmployees();
  }, []);

  const addEmployee = async () => {
    setLoading(true);
    try {
      let photoUrl = '';
      if (formData.image) {
        const formDataForUpload = new FormData();
        formDataForUpload.append('file', formData.image);
        const photoUploadResponse = await fetch('http://localhost:3001/upload-photo', {
          method: 'POST',
          body: formDataForUpload,
        });

        if (photoUploadResponse.ok) {
          const uploadResult = await photoUploadResponse.json();
          photoUrl = uploadResult.url;
        } else {
          setAlert({ message: 'Failed to upload photo.', type: 'error' });
          return;
        }
      }

      const employeeData = { ...formData, image: photoUrl };
      const response = await fetch('http://localhost:3001/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        const newEmployee = await response.json();
        const updatedEmployees = [...employees, newEmployee];
        setEmployees(updatedEmployees);
        setAlert({ message: 'Employee added successfully', type: 'success' });
      } else {
        const errorText = await response.text();
        setAlert({ message: `Error adding employee: ${errorText}`, type: 'error' });
      }
    } catch (error) {
      setAlert({ message: `Error adding employee: ${error}`, type: 'error' });
    } finally {
      setLoading(false);
      setShowAddForm(false);
      setFormData({});
    }
  };

  const updateEmployee = async () => {
    setLoading(true);
    try {
      let photoUrl = formData.image;
      if (typeof formData.image === 'object') {
        const formDataForUpload = new FormData();
        formDataForUpload.append('file', formData.image);
        const photoUploadResponse = await fetch('http://localhost:3001/upload-photo', {
          method: 'POST',
          body: formDataForUpload,
        });

        if (photoUploadResponse.ok) {
          const uploadResult = await photoUploadResponse.json();
          photoUrl = uploadResult.url;
        } else {
          setAlert({ message: 'Failed to upload photo.', type: 'error' });
          return;
        }
      }

      const employeeData = { ...formData, image: photoUrl };
      const response = await fetch(`http://localhost:3001/api/employees/${editEmployeeEmail}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        const updatedEmployees = employees.map(employee =>
          employee.email === editEmployeeEmail ? employeeData : employee
        );
        setEmployees(updatedEmployees);
        setAlert({ message: 'Employee updated successfully', type: 'success' });
      } else {
        const errorText = await response.text();
        setAlert({ message: `Error updating employee: ${errorText}`, type: 'error' });
      }
    } catch (error) {
      setAlert({ message: `Error updating employee: ${error}`, type: 'error' });
    } finally {
      setLoading(false);
      setShowAddForm(false);
      setIsEditing(false);
      setFormData({});
    }
  };

  const removeEmployee = async (email) => {
    setLoading(true);
    try {
      await fetch(`http://localhost:3001/api/employees/${email}`, {
        method: 'DELETE',
      });

      const updatedEmployees = employees.filter(employee => employee.email !== email);
      setEmployees(updatedEmployees);
      setAlert({ message: 'Employee removed successfully', type: 'success' });
    } catch (error) {
      setAlert({ message: `Error deleting employee: ${error}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditEmployee = (employee) => {
    setFormData(employee);
    setShowAddForm(true);
    setIsEditing(true);
    setEditEmployeeEmail(employee.email);
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        {loading && <Loader />}  
        {alert && <Alert message={alert.message} type={alert.type} />} 
        
        {showAddForm ? (
          <AddEmployeeForm
            addEmployee={addEmployee}
            updateEmployee={updateEmployee}
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
          />
        ) : (
          <EmployeeList
            employees={employees}
            removeEmployee={removeEmployee}
            handleEditEmployee={handleEditEmployee}
          />
        )}
        <button className="add-button" onClick={() => setShowAddForm(true)}>
          + Add New Employee
        </button>
      </div>
    </div>
  );
}

export default App;
