import React, { useState } from 'react';
import OrdersList from '../components/OrdersList';
import AddOrder from '../components/AddOrder';

const Orders = () => {
  const [activeComponent, setActiveComponent] = useState('list');
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
              Danh sách Đơn Hàng
            </button>
            <button
              className="list-group-item list-group-item-action"
              onClick={() => setActiveComponent('add')}
            >
              Thêm Đơn hàng
            </button>
          </div>
        </div>
        <div className="col-md-9">
          {/* Render component tương ứng với lựa chọn */}
          {activeComponent === 'list' ? <OrdersList /> : <AddOrder />}
        </div>
      </div>
    </div>
  );
};

export default Orders;