import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css'; // Import the new CSS file

const Home = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get('/api/services');
                setServices(res.data);
            } catch (err) {
                console.error("Failed to fetch services", err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    if (loading) {
        return <div>Loading services...</div>;
    }

    return (
        <div className="home-container">
            <div className="home-header">
                <h1>Welcome to JAsku</h1>
                <p>Find the service you need, or offer your own!</p>
            </div>
            
            <div className="services-grid">
                {services.length > 0 ? (
                    services.map(service => (
                        <Link to={`/service/${service.id}`} key={service.id} className="service-card-link">
                            <div className="service-card">
                                <div className="service-card-body">
                                    <p style={{color: '#6b7280', fontSize: '0.8rem'}}>{service.category}</p>
                                    <h3>{service.title}</h3>
                                    <p className="service-card-price">${service.price}</p>
                                </div>
                                <div className="service-card-footer">
                                    <span>by <strong>{service.partner.name}</strong></span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No services available at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default Home;