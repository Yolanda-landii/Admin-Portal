import React, { useState } from 'react';

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
            <h2>Personal Details</h2>
            <input type="text" name="name" placeholder="First name" value={formData.name || ''} onChange={handleChange} required />
            <input type="text" name="surname" placeholder="Last name" value={formData.surname || ''} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Eg. example@email.com" value={formData.email || ''} onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Eg. +27 800 000000" value={formData.phone || ''} onChange={handleChange} required />
            <input type="text" name="position" placeholder="Position" value={formData.position || ''} onChange={handleChange} />
            <input type="text" name="department" placeholder="Department" value={formData.department || ''} onChange={handleChange} />
            <input type="date" name="startDate" placeholder="Start Date" value={formData.startDate || ''} onChange={handleChange} />
            <input type="file" name="image" accept="image/*" onChange={handleChange} />
            {preview && <img src={preview} alt="Preview" className="image-preview" />}
            <button type="submit">Submit</button>
        </form>
    );
}

export default AddEmployeeForm;
