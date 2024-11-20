import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CustomerCard from '../components/CustomerCard';

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/khachhang')
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.error('Error fetching customers:', error));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="container p-4">
          <h1>Customers</h1>
          <div className="row">
            {customers.map((customer) => (
              <div className="col-md-4" key={customer.Ma_khach_hang}>
                <CustomerCard customer={customer} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
