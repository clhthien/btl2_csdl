import React, { useState } from 'react';
import PackagesList from '../components/PackagesList';
import AddPackage from '../components/AddPackage';
import PackageOfCustomer from '../components/PackageOfCustomer';

const Packages = () => {
  const [activeComponent, setActiveComponent] = useState('list');
  let componentToRender;
  if (activeComponent === 'list') {
    componentToRender = <PackagesList />;
  } else if (activeComponent === 'add') {
    componentToRender = <AddPackage />;
  } else if (activeComponent === 'total') {
    componentToRender = <PackageOfCustomer />;
  }
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
            <button
              className="list-group-item list-group-item-action"
              onClick={() => setActiveComponent('total')}
            >
              Search Customer
            </button>
          </div>
        </div>
        <div className="col-md-10">
          {componentToRender}
        </div>
      </div>
    </div>
  );
};

export default Packages;