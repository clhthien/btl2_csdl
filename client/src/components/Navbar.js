import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import file CSS tùy chỉnh

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-custom shadow-lg">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <strong>Admin Dashboard</strong>
        </Link>

        {/* Button Navbar toggle (cho màn hình nhỏ) */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/customers">
                Customers
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders">
                Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/packages">
                Packages
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/warehouses">
                Warehouses
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/advanced">
                Advanced
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
