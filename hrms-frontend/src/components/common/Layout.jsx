import React from 'react';
import Header from './Header';
import './common.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />

      <main className="content">
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} HRMS Lite. All rights reserved.</p>
          <p>v1.0.0</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
