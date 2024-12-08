import React, { useState } from 'react';
import CustomersList from '../components/CustomersList';
import AddCustomer from '../components/AddCustomer';
import './Customers.css'; // Import file CSS tùy chỉnh

const Customers = () => {
  const [activeComponent, setActiveComponent] = useState('list'); // Manage which component is active

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-2">
          {/* Sidebar with options */}
          <div className="list-group">
            <button
              className="list-group-item list-group-item-action"
              onClick={() => setActiveComponent('list')}
            >
              Customer List
            </button>
            <button
              className="list-group-item list-group-item-action"
              onClick={() => setActiveComponent('add')}
            >
              Add Customer
            </button>
          </div>
        </div>
        <div className="col-md-10">
          {/* Render corresponding component based on selection */}
          {activeComponent === 'list' ? <CustomersList /> : <AddCustomer />}
        </div>
      </div>
    </div>
  );
};

export default Customers;
