import React, { useState } from 'react';

function EmployeeCard({ employee, removeEmployee, updateEmployee }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedEmployee, setEditedEmployee] = useState({ ...employee });

    const handleEdit = () => {
        setIsEditing(true);
        setEditedEmployee({ ...employee });
    };

    const handleSave = () => {
        updateEmployee(editedEmployee);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedEmployee({ ...editedEmployee, image: reader.result });
            };
            reader.readAsDataURL(file);
        } else {
            setEditedEmployee({ ...editedEmployee, [name]: value });
        }
    };

    return (
 
        <div className="employee-card">
            <div className="employee-details">
                {isEditing ? (
                    <>
                        <input type="text" name="id" value={editedEmployee.id} onChange={handleChange} disabled />
                        <input type="text" name="name" value={editedEmployee.name} onChange={handleChange} />
                        <input type="text" name="surname" value={editedEmployee.surname} onChange={handleChange} />
                        <input type="email" name="email" value={editedEmployee.email} onChange={handleChange} />
                        <input type="tel" name="phone" value={editedEmployee.phone} onChange={handleChange} />
                        <input type="text" name="position" value={editedEmployee.position} onChange={handleChange} />
                        <input type="text" name="department" value={editedEmployee.department} onChange={handleChange} />
                        <input type="date" name="startDate" value={editedEmployee.startDate} onChange={handleChange} />
                        <input type="file" name="image" accept="image/*" onChange={handleChange} />
                        {editedEmployee.image && <img src={editedEmployee.image} alt="Preview" className="image-preview" />}
                    </>
                ) : (
                    <>
                        {editedEmployee.image && <img src={editedEmployee.image} alt="Preview" className="image-preview" />}
                        <h3>{editedEmployee.id} {editedEmployee.name} {editedEmployee.surname}</h3>
                        <p>Email: {editedEmployee.email}</p>
                        <p>Phone: {editedEmployee.phone}</p>
                        <p>Position: {editedEmployee.position}</p>
                        <p>Department: {editedEmployee.department}</p>
                        <p>Start Date: {editedEmployee.startDate}</p>
                    </>
                )}
            </div>
            <div className="button-container">
                {isEditing ? (
                    <>
                        <button className="save-button" onClick={handleSave}>Save</button>
                        <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                    </>
                ) : (
                    <>
                        <button className="edit-button" onClick={handleEdit}>Edit</button>
                        <button className="delete-button" onClick={() => removeEmployee(employee.id)}>Delete</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default EmployeeCard;