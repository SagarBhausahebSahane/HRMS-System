
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import { APP_NAME } from '../../utils/constants';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/employees', icon: FiUsers, label: 'Employees' },
    { path: '/attendance', icon: FiCalendar, label: 'Attendance' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="logo">{APP_NAME}</h2>
          <p className="logo-subtitle">Human Resource Management</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <Link to="/settings" className="footer-item">
            <FiSettings className="footer-icon" />
            <span>Settings</span>
          </Link>

          <button className="footer-item logout-btn">
            <FiLogOut className="footer-icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
