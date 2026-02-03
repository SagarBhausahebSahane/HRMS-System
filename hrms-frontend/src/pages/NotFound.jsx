import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-icon">
            <FiAlertTriangle size={64} />
          </div>

          <h1 className="not-found-title">404</h1>

          <h2 className="not-found-subtitle">Page Not Found</h2>

          <p className="not-found-text">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>

          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              <FiHome className="btn-icon" />
              Go to Dashboard
            </Link>

            <button
              onClick={() => window.history.back()}
              className="btn btn-secondary"
            >
              Go Back
            </button>
          </div>

          <div className="not-found-links">
            <Link to="/employees" className="link">Employees</Link>
            <Link to="/attendance" className="link">Attendance</Link>
            <Link to="/" className="link">Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
