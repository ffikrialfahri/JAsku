import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Helper function untuk mengatur token di header axios
const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
};

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Fungsi untuk memuat data user jika ada token
    const loadUser = async () => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }
        try {
            const res = await axios.get('/api/auth/me');
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (err) {
            // Token tidak valid atau expired
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    
    // useEffect untuk memuat user saat aplikasi pertama kali render
    useEffect(() => {
        loadUser();
    }, []);

    const register = async (formData) => {
        try {
            const res = await axios.post('/api/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            await loadUser(); // Muat data user setelah register
            navigate('/');
        } catch (err) {
            console.error(err.response.data);
            alert('Registration failed');
        }
    };

    const login = async (formData) => {
        try {
            const res = await axios.post('/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            await loadUser(); // Muat data user setelah login
            navigate('/');
        } catch (err) {
            console.error(err.response.data);
            alert('Login failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setAuthToken(null); // Hapus token dari header axios
        navigate('/login');
    };

    const value = {
        token,
        user,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};