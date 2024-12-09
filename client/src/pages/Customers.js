import React, { useState } from 'react';
import CustomersList from '../components/CustomersList';
import AddCustomer from '../components/AddCustomer';
import CustomerTotalPrice from '../components/CustomerTotalPrice';
import './Customers.css'; // Import file CSS tùy chỉnh

const Customers = () => {
  const [activeComponent, setActiveComponent] = useState('list'); // Manage which component is active

  let componentToRender;
  if (activeComponent === 'list') {
    componentToRender = <CustomersList />;
  } else if (activeComponent === 'add') {
    componentToRender = <AddCustomer />;
  } else if (activeComponent === 'total') {
    componentToRender = <CustomerTotalPrice />;
  }

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
              Customers List
            </button>
            <button
              className="list-group-item list-group-item-action"
              onClick={() => setActiveComponent('add')}
            >
              Add Customer
            </button>
            <button
              className="list-group-item list-group-item-action"
              onClick={() => setActiveComponent('total')}
            >
              Total Value of The Package
            </button>
          </div>
        </div>
        <div className="col-md-10">
          {/* Render corresponding component based on selection */}
          {componentToRender}
        </div>
      </div>
    </div>
  );

};

export default Customers;
