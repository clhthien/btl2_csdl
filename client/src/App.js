import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import UpdateCustomer from './components/UpdateCustomer';
import UpdateEmployee from './components/UpdateEmployee';
import UpdateOrder from './components/UpdateOrder';
import UpdatePackage from './components/UpdatePackage';
import UpdateWarehouse from './components/UpdateWarehouse';
import Employees from './pages/Employees';
import Orders from './pages/Orders';
import Packages from './pages/Packages';
import Warehouses from './pages/Warehouses';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="d-flex">
        <div className="container p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path='/customers/update/:id' element={<UpdateCustomer />}/>
            <Route path="/employees" element={<Employees />} />
            <Route path='/employees/update/:id' element={<UpdateEmployee/>}/>
            <Route path="/orders" element={<Orders />} />
            <Route path='/orders/update/:id' element={<UpdateOrder />}/>
            <Route path="/packages" element={<Packages />} />
            <Route path='/packages/update/:id' element={<UpdatePackage/>}/>
            <Route path="/warehouses" element={<Warehouses />} />
            <Route path='/warehouses/update/:id' element={<UpdateWarehouse/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
