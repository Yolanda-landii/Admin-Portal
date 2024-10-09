import React, { useState } from 'react';

function AddEmployeeForm({ addEmployee, updateEmployee, formData, setFormData, isEditing }) {
  const [preview, setPreview] = useState(formData.image ? formData.image : '');

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
    if (!formData.email || !formData.name || !formData.surname || !formData.phone || !formData.idNumber) {
      alert('Please fill in all required fields.');
      return;
    }
    if (isEditing) {
      updateEmployee();  // Update employee if in edit mode
    } else {
      addEmployee();  // Add employee if not editing
    }
    setFormData({});
    setPreview('');
  };

  return (
    <form className="add-employee-form" onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" value={formData.name || ''} onChange={handleChange} required />
      <input type="text" name="surname" placeholder="Surname" value={formData.surname || ''} onChange={handleChange} required />
      <input type="text" name="idNumber" placeholder="ID Number" value={formData.idNumber || ''} onChange={handleChange} required />
      <input type="text" name="role" placeholder="Role" value={formData.role || ''} onChange={handleChange} required />
      <input type="number" name="age" placeholder="Age" value={formData.age || ''} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email || ''} onChange={handleChange} required />
      <input type="tel" name="phone" placeholder="Phone" value={formData.phone || ''} onChange={handleChange} required />
      <input type="file" name="image" accept="image/*" onChange={handleChange} />
      {preview && <img src={preview} alt="Preview" className="image-preview" />}
      <button type="submit">{isEditing ? 'Update Employee' : 'Add Employee'}</button>
    </form>
  );
}

export default AddEmployeeForm;
