import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Bell, User } from 'lucide-react';
import './Sidebar.css'; // Impor file CSS baru

const Sidebar = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return null; // Jangan tampilkan sidebar jika tidak login
  }

  // Helper component untuk link dengan tooltip
  const SidebarLink = ({ to, icon: Icon, label }) => (
    <li className="sidebar-link-wrapper">
      <NavLink to={to} className="sidebar-link" title={label}>
        <Icon size={24} />
        <span className="sidebar-tooltip">{label}</span>
      </NavLink>
    </li>
  );

  return (
    <nav className="sidebar">
      <ul className="sidebar-nav">
        <SidebarLink to="/" icon={Home} label="Beranda" />
        <SidebarLink to="/notifications" icon={Bell} label="Notifikasi" />
        {user.role === 'PARTNER' && (
          <SidebarLink to="/dashboard" icon={User} label="Anda" />
        )}
      </ul>
    </nav>
  );
};

export default Sidebar;