import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="container p-4">
          <h1>Welcome to the Dashboard</h1>
          <p>Overview of your system.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
