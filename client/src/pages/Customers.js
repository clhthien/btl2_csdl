import React, { useState } from 'react';
import CustomersList from '../components/CustomersList';
import AddCustomer from '../components/AddCustomer';

const Customers = () => {
  const [activeComponent, setActiveComponent] = useState('list'); // Quản lý phần tử nào được hiển thị

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-3">
          {/* Sidebar chứa các lựa chọn */}
          <div className="list-group">
            <button
              className="list-group-item list-group-item-action"
              onClick={() => setActiveComponent('list')}
            >
              Danh sách Khách Hàng
            </button>
            <button
              className="list-group-item list-group-item-action"
              onClick={() => setActiveComponent('add')}
            >
              Thêm Khách Hàng
            </button>
          </div>
        </div>
        <div className="col-md-9">
          {/* Render component tương ứng với lựa chọn */}
          {activeComponent === 'list' ? <CustomersList /> : <AddCustomer />}
        </div>
      </div>
    </div>
  );
};

export default Customers;
