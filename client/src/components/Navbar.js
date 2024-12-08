import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">Admin Dashboard</Link>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/customers">Customers</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/employees">Employees</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/orders">Orders</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/packages">Package</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/warehouses">Warehouse</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
