import React, { useState } from 'react';
import './AddCustomer.css'; // Giữ nguyên liên kết tới file CSS

const AddCustomer = () => {
  const [customer, setCustomer] = useState({
    Ma_khach_hang: '',
    Ho_ten_dem: '',
    Ten: '',
    SDT: '',
    Email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({
      ...customer,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customer.customerCode || !customer.firstName || !customer.lastName || !customer.phone || !customer.email) {
      alert('Please fill out all the information.');
      return;
    }

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Customer added successfully!');
        setCustomer({
          Ma_khach_hang: '',
          Ho_ten_dem: '',
          Ten: '',
          SDT: '',
          Email: ''
        });
      } else {
        alert(data.message || 'Error occurred while adding the customer.');
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Unable to connect to the server.');
    }
  };

  return (
    <div className="container-fluid mt-3">
      <h2 className="text-center mb-4">Add Customer</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form onSubmit={handleSubmit} className="shadow-lg p-4 rounded border">
            <div className="form-group row mb-3">
              <label htmlFor="customerCode" className="col-md-4 col-form-label">Customer ID:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="customerCode"
                  name="customerCode"
                  value={customer.Ma_khach_hang}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="firstName" className="col-md-4 col-form-label">First Name:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={customer.Ho_ten_dem}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="lastName" className="col-md-4 col-form-label">Last Name:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={customer.Ten}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="phone" className="col-md-4 col-form-label">Phone Number:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  name="phone"
                  value={customer.SDT}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="email" className="col-md-4 col-form-label">Email:</label>
              <div className="col-md-8">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={customer.Email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block mt-4">Add Customer</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
