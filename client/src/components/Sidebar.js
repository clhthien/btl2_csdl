import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="d-flex flex-column bg-light" style={{ width: '200px', height: '100vh' }}>
      <Link className="p-3" to="/customers">Customers</Link>
      <Link className="p-3" to="/employees">Employees</Link>
      <Link className="p-3" to="/orders">Orders</Link>
    </div>
  );
};

export default Sidebar;
