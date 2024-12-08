import React, { useState } from 'react';
import WarehousesList from '../components/WarehousesList';
import AddWarehouse from '../components/AddWarehouse';

const Warehouses = () => {
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
              Danh sách Kho Hàng
            </button>
            <button
              className="list-group-item list-group-item-action"
              onClick={() => setActiveComponent('add')}
            >
              Thêm Kho Hàng
            </button>
          </div>
        </div>
        <div className="col-md-9">
          {/* Render component tương ứng với lựa chọn */}
          {activeComponent === 'list' ? <WarehousesList /> : <AddWarehouse />}
        </div>
      </div>
    </div>
  );
};

export default Warehouses;