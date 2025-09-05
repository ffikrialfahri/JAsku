import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [pendingServices, setPendingServices] = useState([]);

    const fetchPendingServices = async () => {
        try {
            // Set header untuk otentikasi
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            const res = await axios.get('/api/admin/services/pending', config);
            setPendingServices(res.data);
        } catch (err) {
            console.error("Failed to fetch pending services", err);
        }
    };

    useEffect(() => {
        fetchPendingServices();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };
            await axios.put(`/api/admin/services/${id}/status`, { status }, config);
            fetchPendingServices();
            alert(`Service has been ${status}.`);
        } catch (err) {
            console.error("Failed to update status", err);
            alert('Operation failed.');
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <h3>Pending Service Approvals</h3>
            {pendingServices.length > 0 ? (
                pendingServices.map(service => (
                    <div key={service.id} className="service-card">
                        <h4>{service.title}</h4>
                        <div className="service-card-meta">
                            <span>By: <strong>{service.partner.name}</strong></span> | 
                            <span>Price: <strong>${service.price}</strong></span>
                        </div>
                        <p>{service.description}</p>
                        <div className="service-card-actions">
                            <button onClick={() => handleStatusUpdate(service.id, 'approved')} className="action-button approve-button">
                                <CheckCircle size={20} />
                                <span>Approve</span>
                            </button>
                            <button onClick={() => handleStatusUpdate(service.id, 'rejected')} className="action-button reject-button">
                                <XCircle size={20} />
                                <span>Reject</span>
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-services-message">
                    <p>No services are currently awaiting approval.</p>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;