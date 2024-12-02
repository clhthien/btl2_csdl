import React from 'react';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <div className="container p-4">
          <h1>Welcome to the Dashboard</h1>
          <p>Overview of your system.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
