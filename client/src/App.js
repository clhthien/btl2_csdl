import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import UpdateCustomer from './components/UpdateCustomer';
// import Employees from './pages/Employees';
// import Orders from './pages/Orders';
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
            {/* <Route path="/employees" element={<Employees />} /> */}
            {/* <Route path="/orders" element={<Orders />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
