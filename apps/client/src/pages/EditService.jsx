import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditService = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        price: ''
    });
    const navigate = useNavigate();
    const { id } = useParams(); // Mengambil ID dari URL

    // Fetch data service yang akan di-edit saat komponen dimuat
    useEffect(() => {
        const getService = async () => {
            try {
                const res = await axios.get(`/api/services/${id}`);
                setFormData({
                    title: res.data.title,
                    description: res.data.description,
                    category: res.data.category,
                    price: res.data.price
                });
            } catch (err) {
                console.error(err);
                alert('Could not fetch service data.');
                navigate('/dashboard');
            }
        };
        getService();
    }, [id, navigate]);
    
    const { title, description, category, price } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await axios.put(`/api/services/${id}`, formData);
            alert('Service updated successfully!');
            navigate('/dashboard'); // Kembali ke dashboard setelah berhasil
        } catch (err) {
            console.error(err.response.data);
            alert('Failed to update service.');
        }
    };

    return (
        <div>
            <h2>Edit Service</h2>
            <form onSubmit={onSubmit}>
                <div><input type="text" placeholder="Service Title" name="title" value={title} onChange={onChange} required /></div>
                <div><textarea placeholder="Service Description" name="description" value={description} onChange={onChange} required /></div>
                <div><input type="text" placeholder="Category" name="category" value={category} onChange={onChange} required /></div>
                <div><input type="number" placeholder="Price" name="price" value={price} onChange={onChange} required /></div>
                <input type="submit" value="Update Service" />
            </form>
        </div>
    );
};

export default EditService;