import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateService.css'; // Import the new CSS file

const CreateService = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: ''
    });
    const navigate = useNavigate();

    const { title, description, category, price } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        };
        try {
            await axios.post('/api/services', formData, config);
            alert('Service created! It will be reviewed by an admin shortly.');
            navigate('/dashboard'); // Kembali ke dashboard setelah berhasil
        } catch (err) {
            console.error(err.response.data);
            alert('Failed to create service.');
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h1>Offer a New Service</h1>
            </div>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Service Title</label>
                    <input id="title" className="form-input" type="text" placeholder="e.g., Professional Logo Design" name="title" value={title} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Service Description</label>
                    <textarea id="description" className="form-textarea" placeholder="Describe your service in detail..." name="description" value={description} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input id="category" className="form-input" type="text" placeholder="e.g., Design & Graphics" name="category" value={category} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price ($)</label>
                    <input id="price" className="form-input" type="number" placeholder="e.g., 50" name="price" value={price} onChange={onChange} required />
                </div>
                <button type="submit" className="form-button">Submit for Review</button>
            </form>
        </div>
    );
};

export default CreateService;