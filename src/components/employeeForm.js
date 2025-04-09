import React, { useState } from 'react';

function AddEmployeeForm({ addEmployee, updateEmployee, formData, setFormData, isEditing }) {
  const [preview, setPreview] = useState(formData.image ? formData.image : '');
  const [errors, setErrors] = useState({});

  const softwareRoles = [
    'Developer',
    'Designer',
    'Manager',
    'QA Engineer',
    'DevOps Engineer',
    'Product Owner',
    'Scrum Master',
    'Data Scientist',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'UI/UX Designer',
    'System Administrator',
    'Technical Lead',
    'Architect'
  ];

  const validate = () => {
    let errors = {};

    // Name validation
    if (!formData.name) errors.name = 'Name is required';
    
    // Surname validation
    if (!formData.surname) errors.surname = 'Surname is required';
    
    // ID Number validation - must be exactly 13 digits
    if (!formData.idNumber) {
      errors.idNumber = 'ID Number is required';
    } else if (!/^\d{13}$/.test(formData.idNumber)) {
      errors.idNumber = 'ID Number must be exactly 13 digits';
    }
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation - must be exactly 10 digits
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Phone number must be exactly 10 digits';
    }
    
    // Role validation
    if (!formData.role) errors.role = 'Role is required';

    return errors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files[0]) {
      setFormData(prevState => ({ ...prevState, image: files[0] }));
      setPreview(URL.createObjectURL(files[0])); 
    } else {
      setFormData(prevState => ({ ...prevState, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    if (isEditing) {
      updateEmployee();
    } else {
      addEmployee();
    }

    setFormData({});
    setPreview('');
    setErrors({});
  };

  return (
    <form className="add-employee-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input 
          type="text" 
          name="name" 
          placeholder="Name" 
          value={formData.name || ''} 
          onChange={handleChange} 
          className={errors.name ? 'input error' : ''}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <input 
          type="text" 
          name="surname" 
          placeholder="Surname" 
          value={formData.surname || ''} 
          onChange={handleChange} 
          className={errors.surname ? 'input error' : ''}
        />
        {errors.surname && <span className="field-error">{errors.surname}</span>}
      </div>

      <div className="form-group">
        <input 
          type="text" 
          name="idNumber" 
          placeholder="ID Number (13 digits)" 
          value={formData.idNumber || ''} 
          onChange={handleChange} 
          className={errors.idNumber ? 'input error' : ''}
        />
        {errors.idNumber && <span className="field-error">{errors.idNumber}</span>}
      </div>

      <div className="form-group">
        <select 
          name="role" 
          value={formData.role || ''} 
          onChange={handleChange}
          className={`role-select ${errors.role ? 'input error' : ''}`}
        >
          <option value="">Select Role</option>
          {softwareRoles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        {errors.role && <span className="field-error">{errors.role}</span>}
      </div>

      <div className="form-group">
        <input 
          type="number" 
          name="age" 
          placeholder="Age" 
          value={formData.age || ''} 
          onChange={handleChange}  
        />
      </div>

      <div className="form-group">
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email || ''} 
          onChange={handleChange} 
          className={errors.email ? 'input error' : ''}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <input 
          type="tel" 
          name="phone" 
          placeholder="Phone (10 digits)" 
          value={formData.phone || ''} 
          onChange={handleChange} 
          className={errors.phone ? 'input error' : ''}
        />
        {errors.phone && <span className="field-error">{errors.phone}</span>}
      </div>

      <div className="form-group">
        <input 
          type="file" 
          name="image" 
          accept="image/*" 
          onChange={handleChange} 
        />
        {preview && <img src={preview} alt="Preview" className="image-preview" />}
      </div>

      <button type="submit" className="submit-button">
        {isEditing ? 'Update Employee' : 'Add Employee'}
      </button>
    </form>
  );
}

export default AddEmployeeForm;
