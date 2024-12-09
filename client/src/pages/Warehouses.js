import React, { useState } from 'react';
import WarehousesList from '../components/WarehousesList';
import AddWarehouse from '../components/AddWarehouse';

const Warehouses = () => {
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
              Warehouses List
            </button>
            <button
              className="list-group-item list-group-item-action"
              onClick={() => setActiveComponent('add')}
            >
              Add Warehouse
            </button>
          </div>
        </div>
        <div className="col-md-10">
          {/* Render component tương ứng với lựa chọn */}
          {activeComponent === 'list' ? <WarehousesList /> : <AddWarehouse />}
        </div>
      </div>
    </div>
  );
};

export default Warehouses;