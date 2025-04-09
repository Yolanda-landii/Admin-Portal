import React, { useState, useEffect } from 'react';
import './Pages.css';
import AddEmployeeForm from '../employeeForm';
import axios from 'axios';

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/employees');
      console.log('Fetched employees:', response.data);
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post('http://localhost:3001/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.url;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new Error('Failed to upload image');
    }
  };

  const addEmployee = async (formData) => {
    try {
      console.log('Adding employee with data:', formData);
      let imageUrl = formData.image;
      
      // Upload image if provided
      if (formData.image instanceof File) {
        imageUrl = await uploadImage(formData.image);
      }
      
      // Prepare employee data
      const employeeData = {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        idNumber: formData.idNumber,
        department: formData.department,
        techStack: formData.techStack,
        githubUsername: formData.githubUsername || '',
        linkedinProfile: formData.linkedinProfile || '',
        image: imageUrl
      };
      
      console.log('Sending add request with data:', employeeData);
      const response = await axios.post('http://localhost:3001/api/employees', employeeData);
      
      if (response.data) {
        fetchEmployees();
        setFormData({});
        setActiveView('dashboard');
      } else {
        throw new Error('Failed to add employee');
      }
    } catch (err) {
      console.error('Error adding employee:', err);
      throw err;
    }
  };

  const updateEmployee = async (formData) => {
    try {
      console.log('Updating employee with data:', formData);
      let imageUrl = formData.image;
      
      // Upload new image if provided
      if (formData.image instanceof File) {
        imageUrl = await uploadImage(formData.image);
      }
      
      // Prepare employee data
      const employeeData = {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        department: formData.department,
        techStack: formData.techStack,
        githubUsername: formData.githubUsername || '',
        linkedinProfile: formData.linkedinProfile || '',
        image: imageUrl
      };
      
      console.log('Sending update request with data:', employeeData);
      const response = await axios.put(`http://localhost:3001/api/employees/${formData.idNumber}`, employeeData);
      
      if (response.data) {
        fetchEmployees();
        setFormData({});
        setIsEditing(false);
        setActiveView('dashboard');
      } else {
        throw new Error('Failed to update employee');
      }
    } catch (err) {
      console.error('Error updating employee:', err);
      throw err;
    }
  };

  const deleteEmployee = async (idNumber) => {
    try {
      console.log('Deleting employee with ID:', idNumber);
      const response = await axios.delete(`http://localhost:3001/api/employees/${idNumber}`);
      
      if (response.status === 200) {
        fetchEmployees();
        setActiveView('dashboard');
      } else {
        throw new Error('Failed to delete employee');
      }
    } catch (err) {
      console.error('Error deleting employee:', err);
      throw err;
    }
  };

  const editEmployee = (employee) => {
    console.log('Editing employee:', employee);
    setFormData({
      name: employee.name,
      surname: employee.surname,
      email: employee.email,
      phone: employee.phone,
      idNumber: employee.idNumber,
      role: employee.role,
      department: employee.department || '',
      techStack: employee.techStack || '',
      githubUsername: employee.githubUsername || '',
      linkedinProfile: employee.linkedinProfile || '',
      image: employee.image || ''
    });
    setIsEditing(true);
    setActiveView('edit');
  };

  const getEmployeeStats = () => {
    const totalEmployees = employees.length;
    const roleCounts = {};
    
    employees.forEach(employee => {
      const role = employee.role || 'Unassigned';
      if (roleCounts[role]) {
        roleCounts[role]++;
      } else {
        roleCounts[role] = 1;
      }
    });
    
    return {
      total: totalEmployees,
      roles: roleCounts
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
  const roles = Object.keys(stats.roles);

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Admin Portal</h2>
        <ul>
          <li>
            <a href="#" onClick={() => setActiveView('dashboard')}>
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" onClick={() => setActiveView('employees')}>
              Employees
            </a>
          </li>
          <li>
            <a href="#" onClick={() => {
              setFormData({});
              setIsEditing(false);
              setActiveView('add');
            }}>
              Add Employee
            </a>
          </li>
        </ul>
      </div>

      <div className="main-content">
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {activeView === 'dashboard' && (
          <>
            <div className="dashboard-header">
              <h1>Dashboard</h1>
              <div className="dashboard-actions">
                <button 
                  className="action-button" 
                  onClick={() => setActiveView('employees')}
                >
                  <i className="fas fa-users"></i> View Employees
                </button>
                <button 
                  className="action-button" 
                  onClick={() => {
                    setFormData({});
                    setIsEditing(false);
                    setActiveView('add');
                  }}
                >
                  <i className="fas fa-plus"></i> Add Employee
                </button>
              </div>
            </div>

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
                  <h3>Roles</h3>
                  <p className="stat-value">{roles.length}</p>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Role Distribution</h3>
                <div className="role-distribution">
                  {roles.map(role => (
                    <div key={role} className="role-item">
                      <span className="role-name">{role}</span>
                      <div className="role-bar-container">
                        <div 
                          className="role-bar" 
                          style={{ width: `${(stats.roles[role] / stats.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="role-count">{stats.roles[role]}</span>
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
          </>
        )}

        {activeView === 'employees' && (
          <>
            <div className="dashboard-header">
              <h1>Employees</h1>
              <div className="dashboard-actions">
                <button 
                  className="action-button" 
                  onClick={() => setActiveView('dashboard')}
                >
                  <i className="fas fa-chart-line"></i> Dashboard
                </button>
                <button 
                  className="action-button" 
                  onClick={() => {
                    setFormData({});
                    setIsEditing(false);
                    setActiveView('add');
                  }}
                >
                  <i className="fas fa-plus"></i> Add Employee
                </button>
              </div>
            </div>

            <div className="employee-list-header">
              <div className="employee-filters">
                <div className="search-container">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="filter-select"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="employee-cards">
              {filteredEmployees.map(employee => (
                <div key={employee.email} className="employee-card">
                  {employee.image ? (
                    <img src={employee.image} alt={`${employee.name} ${employee.surname}`} />
                  ) : (
                    <div className="employee-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                  <h3>{employee.name} {employee.surname}</h3>
                  <p className="employee-role">{employee.role || 'Unassigned'}</p>
                  <p className="employee-department">{employee.department || 'No Department'}</p>
                  <p className="employee-tech">{employee.techStack || 'No Tech Stack'}</p>
                  <p className="employee-email">{employee.email}</p>
                  <div className="employee-actions">
                    <button 
                      className="delete-button"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this employee?')) {
                          deleteEmployee(employee.idNumber);
                        }
                      }}
                    >
                      Delete
                    </button>
                    <button 
                      className="edit-button"
                      onClick={() => editEmployee(employee)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeView === 'add' && (
          <>
            <div className="dashboard-header">
              <h1>Add Employee</h1>
              <button 
                className="action-button" 
                onClick={() => setActiveView('dashboard')}
              >
                <i className="fas fa-arrow-left"></i> Back to Dashboard
              </button>
            </div>
            <AddEmployeeForm 
              onSubmit={addEmployee}
              initialData={formData}
              isEditing={isEditing}
            />
          </>
        )}

        {activeView === 'edit' && (
          <>
            <div className="dashboard-header">
              <h1>Edit Employee</h1>
              <button 
                className="action-button" 
                onClick={() => setActiveView('dashboard')}
              >
                <i className="fas fa-arrow-left"></i> Back to Dashboard
              </button>
            </div>
            <AddEmployeeForm 
              onSubmit={updateEmployee}
              initialData={formData}
              isEditing={isEditing}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
