import React, { useState } from 'react';

function AddEmployeeForm({ addEmployee, updateEmployee, formData, setFormData, isEditing }) {
  const [preview, setPreview] = useState(formData.image ? formData.image : '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    let errors = {};

    
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.surname) errors.surname = 'Surname is required';
    if (!formData.idNumber) errors.idNumber = 'ID Number is required';
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.phone) {
      errors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {  
      errors.phone = 'Phone number is invalid';
    }
    if (!formData.idNumber) {
      errors.idNumber = 'ID Number is required';
    } else if (!/^\d{13}$/.test(formData.idNumber)) {  
      errors.idNumber = 'ID Number is invalid';
    }

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
      <input 
        type="text" 
        name="name" 
        placeholder="Name" 
        value={formData.name || ''} 
        onChange={handleChange} 
        required 
      />
      {errors.name && <span className="error">{errors.name}</span>}

      <input 
        type="text" 
        name="surname" 
        placeholder="Surname" 
        value={formData.surname || ''} 
        onChange={handleChange} 
        required 
      />
      {errors.surname && <span className="error">{errors.surname}</span>}

      <input 
        type="text" 
        name="idNumber" 
        placeholder="ID Number" 
        value={formData.idNumber || ''} 
        onChange={handleChange} 
        required 
      />
      {errors.idNumber && <span className="error">{errors.idNumber}</span>}

      <input 
        type="text" 
        name="role" 
        placeholder="Role" 
        value={formData.role || ''} 
        onChange={handleChange}  
      />

      <input 
        type="number" 
        name="age" 
        placeholder="Age" 
        value={formData.age || ''} 
        onChange={handleChange}  
      />

      <input 
        type="email" 
        name="email" 
        placeholder="Email" 
        value={formData.email || ''} 
        onChange={handleChange} 
        required 
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <input 
        type="tel" 
        name="phone" 
        placeholder="Phone" 
        value={formData.phone || ''} 
        onChange={handleChange} 
        required 
      />
      {errors.phone && <span className="error">{errors.phone}</span>}

      <input 
        type="file" 
        name="image" 
        accept="image/*" 
        onChange={handleChange} 
      />
      {preview && <img src={preview} alt="Preview" className="image-preview" />}

      <button type="submit">
        {isEditing ? 'Update Employee' : 'Add Employee'}
      </button>
    </form>
  );
}

export default AddEmployeeForm;
