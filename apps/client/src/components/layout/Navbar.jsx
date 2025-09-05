import React, { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, PlusSquare, User, LogOut, LogIn, UserPlus, Search, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${keyword}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  const authLinks = (
    <Fragment>
        {user && user.role === 'ADMIN' && (
            <Link to="/admin" className="navbar-link"><ShieldCheck size={20} /><span>Admin Panel</span></Link>
        )}
        {user && user.role === 'PARTNER' && (
            <Fragment>
                <Link to="/create-service" className="navbar-link"><PlusSquare size={20} /><span>Create Service</span></Link>
                <Link to="/dashboard" className="navbar-link"><User size={20} /><span>Dashboard</span></Link>
            </Fragment>
        )}
        {user && user.role === 'CUSTOMER' && (
            <Link to="/dashboard" className="navbar-link"><User size={20} /><span>Account</span></Link>
        )}
        <a onClick={logout} href="#!" className="navbar-link"><LogOut size={20} /><span>Logout</span></a>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <Link to="/login" className="navbar-link"><LogIn size={20} /><span>Login</span></Link>
      <Link to="/register" className="navbar-button"><UserPlus size={18} /> Register</Link>
    </Fragment>
  );

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1><Link to="/">JAsku</Link></h1>
      </div>

      <div className="search-bar">
        <Search size={20} className="search-bar-icon" />
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search for services..."
            className="search-bar-input"
          />
        </form>
      </div>

      <div className="navbar-actions">
        <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
        
        {/* Mobile Menu Button */}
        <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}></div>}
      
      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
            <h2>Menu</h2>
            <button className="mobile-nav-close-button" onClick={() => setMobileMenuOpen(false)}>
                <X size={28} />
            </button>
        </div>
        <ul>
            {isAuthenticated ? authLinks : guestLinks}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;