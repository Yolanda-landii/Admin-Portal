import React, { useState, useEffect } from 'react';
import './employeeForm.css';

const AddEmployeeForm = ({ onSubmit, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    idNumber: '',
    role: '',
    department: '',
    techStack: '',
    githubUsername: '',
    linkedinProfile: '',
    image: ''
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setImagePreview(initialData.image || '');
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = {
      name: 'Name',
      surname: 'Surname',
      email: 'Email',
      phone: 'Phone number',
      idNumber: 'ID number',
      role: 'Role',
      department: 'Department',
      techStack: 'Tech stack'
    };

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field]) {
        newErrors[field] = `${label} is required`;
      }
    });

    // ID number validation (13 digits)
    if (formData.idNumber && !/^\d{13}$/.test(formData.idNumber)) {
      newErrors.idNumber = 'ID number must be exactly 13 digits';
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone validation (10 digits)
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setSubmitSuccess(true);
      
      if (!isEditing) {
        // Reset form only if not in editing mode
        setFormData({
          name: '',
          surname: '',
          email: '',
          phone: '',
          idNumber: '',
          role: '',
          department: '',
          techStack: '',
          githubUsername: '',
          linkedinProfile: '',
          image: ''
        });
        setImagePreview('');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error.message || 'An error occurred while submitting the form');
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      {submitError && (
        <div className="error-message">
          {submitError}
        </div>
      )}
      {submitSuccess && (
        <div className="success-message">
          {isEditing ? 'Employee updated successfully!' : 'Employee added successfully!'}
        </div>
      )}
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={errors.name ? 'error' : ''}
            placeholder="Enter name"
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="surname">Surname *</label>
          <input
            type="text"
            id="surname"
            value={formData.surname}
            onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
            className={errors.surname ? 'error' : ''}
            placeholder="Enter surname"
          />
          {errors.surname && <span className="error-text">{errors.surname}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={errors.email ? 'error' : ''}
            placeholder="Enter email"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className={errors.phone ? 'error' : ''}
            placeholder="Enter phone number"
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="idNumber">ID Number *</label>
          <input
            type="text"
            id="idNumber"
            value={formData.idNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
            className={errors.idNumber ? 'error' : ''}
            placeholder="Enter ID number"
          />
          {errors.idNumber && <span className="error-text">{errors.idNumber}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="role">Role *</label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            className={`role-select ${errors.role ? 'error' : ''}`}
          >
            <option value="">Select a role</option>
            <option value="Web Dev">Web Developer</option>
            <option value="Mobile Dev">Mobile Developer</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Admin">Admin</option>
          </select>
          {errors.role && <span className="error-text">{errors.role}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="department">Department *</label>
          <input
            type="text"
            id="department"
            value={formData.department}
            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
            className={errors.department ? 'error' : ''}
            placeholder="Enter department"
          />
          {errors.department && <span className="error-text">{errors.department}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="techStack">Tech Stack *</label>
          <input
            type="text"
            id="techStack"
            value={formData.techStack}
            onChange={(e) => setFormData(prev => ({ ...prev, techStack: e.target.value }))}
            className={errors.techStack ? 'error' : ''}
            placeholder="Enter tech stack"
          />
          {errors.techStack && <span className="error-text">{errors.techStack}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="githubUsername">GitHub Username</label>
          <input
            type="text"
            id="githubUsername"
            value={formData.githubUsername}
            onChange={(e) => setFormData(prev => ({ ...prev, githubUsername: e.target.value }))}
            placeholder="Enter GitHub username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="linkedinProfile">LinkedIn Profile</label>
          <input
            type="url"
            id="linkedinProfile"
            value={formData.linkedinProfile}
            onChange={(e) => setFormData(prev => ({ ...prev, linkedinProfile: e.target.value }))}
            placeholder="Enter LinkedIn profile URL"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="image">Profile Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Profile preview" />
            </div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : (isEditing ? 'Update' : 'Add')}
        </button>
      </div>
    </form>
  );
};

export default AddEmployeeForm;
