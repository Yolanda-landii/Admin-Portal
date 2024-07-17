import React, { useState } from 'react';
// import './AddEmployeeForm.css';

function AddEmployeeForm({ addEmployee, formData, setFormData }) {
    const [preview, setPreview] = useState('');

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prevState => ({ ...prevState, image: reader.result }));
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addEmployee();
        setPreview('');
    };

    return (
        <form className="add-employee-form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" value={formData.name || ''} onChange={handleChange} required />
            <input type="text" name="surname" placeholder="Surname" value={formData.surname || ''} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email || ''} onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Phone" value={formData.phone || ''} onChange={handleChange} required />
            <input type="text" name="role" placeholder="Role" value={formData.role || ''} onChange={handleChange} />
            <input type="date" name="startDate" placeholder="Start Date" value={formData.startDate || ''} onChange={handleChange} />
            <input type="file" name="image" accept="image/*" onChange={handleChange} />
            {preview && <img src={preview} alt="Preview" className="image-preview" />}
            <button type="submit">Submit</button>
        </form>
    );
}

export default AddEmployeeForm;
