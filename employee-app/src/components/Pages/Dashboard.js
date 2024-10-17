import React, { useState, useEffect,useCallback } from 'react';
import Sidebar from '../sideBar';
import EmployeeList from '../addEmployeeList';
import AddEmployeeForm from '../employeeForm';
import Loader from '../Loader'; 
import Alert from '../Alert';
import { useNavigate } from 'react-router-dom';  

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editEmployeeEmail, setEditEmployeeEmail] = useState('');
  const [loading, setLoading] = useState(false);   
  const [alert, setAlert] = useState(null); 
  const navigate = useNavigate(); 
  
  const fetchCsrfToken = async () => {
    const response = await fetch('http://localhost:3001/api/csrf-token', {
      method: 'GET',
      credentials: 'include', 
    });
    const data = await response.json();
    return data.csrfToken;
  };

  const checkSessionValidity = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/session-check', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Session is not valid');

      }

      const data = await response.json();
      return data.isValid;
    } catch (error) {
      setAlert({ message: 'Session expired. Please log in again.', type: 'error' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [navigate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkSessionValidity();
    }, 120000); 

    return () => clearInterval(intervalId); 
  }, [checkSessionValidity]);  
  

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);  
      try {
        const csrfToken = await fetchCsrfToken();
        const response = await fetch('http://localhost:3001/api/employees', {
          method: 'GET',
          credentials: 'include', 
          headers: {
            'X-CSRF-Token': csrfToken,
          },
        });
        
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
  
      const csrfToken = await fetchCsrfToken();
  
      if (formData.image) {
        const formDataForUpload = new FormData();
        formDataForUpload.append('file', formData.image);
  
        const photoUploadResponse = await fetch('http://localhost:3001/upload-photo', {
          method: 'POST',
          body: formDataForUpload,
          credentials: 'include', 
          headers: {
            'X-CSRF-Token': csrfToken, 
          },
        });
  
        if (!photoUploadResponse.ok) {
          throw new Error('Failed to upload photo.');
        }
  
        const uploadResult = await photoUploadResponse.json();
        photoUrl = uploadResult.url;
      }
  
      const employeeData = { ...formData, image: photoUrl };
  
      const response = await fetch('http://localhost:3001/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken, 
        },
        body: JSON.stringify(employeeData),
        credentials: 'include', 
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error adding employee: ${errorText}`);
      }
  
      const newEmployee = await response.json();
      const updatedEmployees = [...employees, newEmployee];
      setEmployees(updatedEmployees);
      setAlert({ message: 'Employee added successfully', type: 'success' });
  
      setFormData({});
      setShowAddForm(false);
    } catch (error) {
      setAlert({ message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  

  const updateEmployee = async () => {
    setLoading(true);
    try {
      let photoUrl = formData.image;
  
      const csrfToken = await fetchCsrfToken();
  
      if (typeof formData.image === 'object') {
        const formDataForUpload = new FormData();
        formDataForUpload.append('file', formData.image);
  
        const photoUploadResponse = await fetch('http://localhost:3001/upload-photo', {
          method: 'POST',
          body: formDataForUpload,
          credentials: 'include', 
          headers: {
            'X-CSRF-Token': csrfToken, 
          },
        });
  
        if (!photoUploadResponse.ok) {
          throw new Error('Failed to upload photo.');
        }
  
        const uploadResult = await photoUploadResponse.json();
        photoUrl = uploadResult.url;
      }
  
      const employeeData = { ...formData, image: photoUrl };
  
      const response = await fetch(`http://localhost:3001/api/employees/${editEmployeeEmail}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken, 
        },
        body: JSON.stringify(employeeData),
        credentials: 'include', 
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error updating employee: ${errorText}`);
      }
  
      const updatedEmployees = employees.map(employee =>
        employee.email === editEmployeeEmail ? employeeData : employee
      );
      setEmployees(updatedEmployees);
      setAlert({ message: 'Employee updated successfully', type: 'success' });
  
    } catch (error) {
      setAlert({ message: error.message, type: 'error' });
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
     
      const csrfToken = await fetchCsrfToken();
  
      
      const response = await fetch(`http://localhost:3001/api/employees/${email}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': csrfToken, 
        },
        credentials: 'include', 
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error deleting employee: ${errorText}`);
      }
  
      
      const updatedEmployees = employees.filter(employee => employee.email !== email);
      setEmployees(updatedEmployees);
      setAlert({ message: 'Employee removed successfully', type: 'success' });
  
    } catch (error) {
      setAlert({ message: `Error deleting employee: ${error.message}`, type: 'error' });
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
    <div className="dashboard">
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

export default Dashboard;
