import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Tampilkan loading saat user state sedang diverifikasi
    }

    if (!isAuthenticated) {
        // Jika tidak login, redirect ke halaman login
        return <Navigate to="/login" />;
    }
    
    if (roles && !roles.includes(user.role)) {
        // Jika login, tapi role tidak sesuai, redirect ke halaman utama
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;