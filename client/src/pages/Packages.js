import React, { useState } from 'react';
import PackagesList from '../components/PackagesList';
import AddPackage from '../components/AddPackage';

const Packages = () => {
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
              Packages List
            </button>
            <button
              className="list-group-item list-group-item-action"
              onClick={() => setActiveComponent('add')}
            >
              Add Package
            </button>
          </div>
        </div>
        <div className="col-md-10">
          {/* Render component tương ứng với lựa chọn */}
          {activeComponent === 'list' ? <PackagesList /> : <AddPackage />}
        </div>
      </div>
    </div>
  );
};

export default Packages;