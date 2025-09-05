import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
// Layout
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
// Halaman
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateService from './pages/CreateService';
import EditService from './pages/EditService';
import ServiceDetail from './pages/ServiceDetail';
import SearchResults from './pages/SearchResults';
import AdminDashboard from './pages/AdminDashboard';
// Proteksi
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';
import './App.css';

// Layout Component to wrap around pages that need Navbar/Sidebar
const MainLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const mainContentClass = isAuthenticated ? 'main-content with-sidebar' : 'main-content';

  return (
    <div className="app-container">
      {isAuthenticated && <Sidebar />}
      <div className={mainContentClass}>
        <Navbar />
        <main className="main-content-padded">{children}</main>
      </div>
      {isAuthenticated && <BottomNav />}
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Routes with the main layout */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/dashboard" element={<MainLayout><PrivateRoute><Dashboard /></PrivateRoute></MainLayout>} />
      <Route path="/create-service" element={<MainLayout><PrivateRoute roles={['PARTNER']}><CreateService /></PrivateRoute></MainLayout>} />
      <Route path="/edit-service/:id" element={<MainLayout><PrivateRoute roles={['PARTNER']}><EditService /></PrivateRoute></MainLayout>} />
      <Route path="/service/:id" element={<MainLayout><ServiceDetail /></MainLayout>} />
      <Route path="/search" element={<MainLayout><SearchResults /></MainLayout>} />
      <Route path="/admin" element={<MainLayout><PrivateRoute roles={['ADMIN']}><AdminDashboard /></PrivateRoute></MainLayout>} />
      
      {/* Routes without the main layout (e.g., auth pages) */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;