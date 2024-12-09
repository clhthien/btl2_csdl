import React, { useState } from 'react';
import OrdersList from '../components/OrdersList';
import AddOrder from '../components/AddOrder';

const Orders = () => {
  const [activeComponent, setActiveComponent] = useState('list');
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-2">
          {/* Sidebar chứa các lựa chọn */}
          <div className="list-group">
            <button
              className="list-group-item list-group-item-action"
              onClick={() => setActiveComponent('list')}
            >
              Orders List
            </button>
            <button
              className="list-group-item list-group-item-action"
              onClick={() => setActiveComponent('add')}
            >
              Add Order
            </button>
          </div>
        </div>
        <div className="col-md-10">
          {/* Render component tương ứng với lựa chọn */}
          {activeComponent === 'list' ? <OrdersList /> : <AddOrder />}
        </div>
      </div>
    </div>
  );
};

export default Orders;