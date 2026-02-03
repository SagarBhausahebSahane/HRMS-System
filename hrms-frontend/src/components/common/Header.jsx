import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiCalendar, FiUser, FiBell } from 'react-icons/fi';
import { APP_NAME } from '../../utils/constants';

const Header = () => {
  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/employees', icon: FiUsers, label: 'Employees' },
    { path: '/attendance', icon: FiCalendar, label: 'Attendance' },
  ];

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="header-left">
            <div className="logo">
              <h1 className="logo-text">{APP_NAME}</h1>
              <span className="logo-subtitle">HR Management System</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="header-nav">
            <ul className="nav-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path} className="nav-item">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? 'active' : ''}`
                      }
                    >
                      <Icon className="nav-icon" />
                      <span className="nav-label">{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="header-right">
            <button className="notification-btn" title="Notifications">
              <FiBell size={20} />
              <span className="notification-badge">3</span>
            </button>

            <div className="user-profile">
              <div className="avatar">
                <FiUser size={20} />
              </div>
              <div className="user-info">
                <span className="user-name">Admin</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
