import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Bell, User } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const NavLinkItem = ({ to, icon: Icon, label }) => (
    <li>
      <NavLink to={to} className="bottom-nav-link">
        <Icon size={24} />
        <span>{label}</span>
      </NavLink>
    </li>
  );

  return (
    <nav className="bottom-nav">
      <ul className="bottom-nav-list">
        <NavLinkItem to="/" icon={Home} label="Home" />
        <NavLinkItem to="/notifications" icon={Bell} label="Alerts" />
        {user.role === 'PARTNER' && (
          <NavLinkItem to="/dashboard" icon={User} label="You" />
        )}
        {user.role === 'CUSTOMER' && (
            <NavLinkItem to="/dashboard" icon={User} label="Account" />
        )}
      </ul>
    </nav>
  );
};

export default BottomNav;