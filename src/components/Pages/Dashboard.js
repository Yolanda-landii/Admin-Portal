import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../sideBar';
import EmployeeList from '../addEmployeeList';
import AddEmployeeForm from '../employeeForm';
import Loader from '../Loader';
import Alert from '../Alert';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editEmployeeEmail, setEditEmployeeEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
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
      setActiveView('employee-list');
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
      setActiveView('employee-list');
    }
  };

  const removeEmployee = async (email) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }
    
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
    setActiveView('add-employee');
  };

  const handleLogout = async () => {
    try {
      const csrfToken = await fetchCsrfToken();
      const response = await fetch('http://localhost:3001/api/logout', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': csrfToken,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error(`Logout failed: ${response.status} ${response.statusText}`);
        console.error(`Error message from server: ${errorMessage}`);
        throw new Error('Logout failed');
      }

      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    if (view === 'add-employee') {
      setShowAddForm(true);
    } else {
      setShowAddForm(false);
    }
  };

  const getEmployeeStats = () => {
    const totalEmployees = employees.length;
    const roles = {};
    
    employees.forEach(employee => {
      const role = employee.role || 'Unassigned';
      roles[role] = (roles[role] || 0) + 1;
    });
    
    return {
      total: totalEmployees,
      roles: roles
    };
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      (employee.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.surname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.idNumber || '').includes(searchTerm);
    
    const matchesRole = filterRole === 'all' || employee.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const stats = getEmployeeStats();
  const uniqueRoles = [...new Set(employees.map(emp => emp.role || 'Unassigned'))];

  return (
    <div className="dashboard">
      <Sidebar 
        setShowAddForm={setShowAddForm} 
        handleLogout={handleLogout} 
      />
      <div className="main-content">
        {loading && <Loader />}
        {alert && <Alert message={alert.message} type={alert.type} />}
        
        <div className="dashboard-header">
          <h1>Employee Management</h1>
          <div className="dashboard-actions">
            <button 
              className={`action-button ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleViewChange('dashboard')}
            >
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </button>
            <button 
              className={`action-button ${activeView === 'employee-list' ? 'active' : ''}`}
              onClick={() => handleViewChange('employee-list')}
            >
              <i className="fas fa-users"></i> Employee List
            </button>
            <button 
              className={`action-button ${activeView === 'add-employee' ? 'active' : ''}`}
              onClick={() => handleViewChange('add-employee')}
            >
              <i className="fas fa-user-plus"></i> Add Employee
            </button>
          </div>
        </div>
        
        {showAddForm ? (
          <div className="dashboard-section">
            <h2>{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>
            <AddEmployeeForm
              addEmployee={addEmployee}
              updateEmployee={updateEmployee}
              formData={formData}
              setFormData={setFormData}
              isEditing={isEditing}
            />
          </div>
        ) : activeView === 'employee-list' ? (
          <div className="dashboard-section">
            <div className="employee-list-header">
              <h2>Employee List</h2>
              <div className="employee-filters">
                <div className="search-container">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="filter-container">
                  <select 
                    value={filterRole} 
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Roles</option>
                    {uniqueRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <EmployeeList
              employees={filteredEmployees}
              removeEmployee={removeEmployee}
              handleEditEmployee={handleEditEmployee}
            />
          </div>
        ) : (
          <div className="dashboard-section">
            <h2>Dashboard Overview</h2>
            
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-info">
                  <h3>Total Employees</h3>
                  <p className="stat-value">{stats.total}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div className="stat-info">
                  <h3>Managers</h3>
                  <p className="stat-value">{stats.roles['Manager'] || 0}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-code"></i>
                </div>
                <div className="stat-info">
                  <h3>Developers</h3>
                  <p className="stat-value">{stats.roles['Developer'] || 0}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-paint-brush"></i>
                </div>
                <div className="stat-info">
                  <h3>Designers</h3>
                  <p className="stat-value">{stats.roles['Designer'] || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Employee Roles</h3>
                <div className="role-distribution">
                  {Object.entries(stats.roles).map(([role, count]) => (
                    <div key={role} className="role-item">
                      <div className="role-name">{role}</div>
                      <div className="role-bar-container">
                        <div 
                          className="role-bar" 
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        ></div>
                      </div>
                      <div className="role-count">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="dashboard-card">
                <h3>Recent Employees</h3>
                <div className="recent-employees">
                  {employees.slice(0, 5).map(employee => (
                    <div key={employee.email} className="recent-employee">
                      <div className="recent-employee-avatar">
                        {employee.image ? (
                          <img src={employee.image} alt={`${employee.name} ${employee.surname}`} />
                        ) : (
                          <i className="fas fa-user"></i>
                        )}
                      </div>
                      <div className="recent-employee-info">
                        <h4>{employee.name} {employee.surname}</h4>
                        <p>{employee.role || 'Unassigned'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="dashboard-actions-bottom">
              <button 
                className="primary-button"
                onClick={() => handleViewChange('employee-list')}
              >
                <i className="fas fa-list"></i> View All Employees
              </button>
              <button 
                className="secondary-button"
                onClick={() => handleViewChange('add-employee')}
              >
                <i className="fas fa-user-plus"></i> Add New Employee
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
