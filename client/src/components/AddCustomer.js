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

    if (!customer.Ma_khach_hang || !customer.Ho_ten_dem || !customer.Ten || !customer.SDT || !customer.Email) {
      alert('Please fill out all the information.');
      return;
    }

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/khachhang', {
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
              <label htmlFor="Ma_khach_hang" className="col-md-4 col-form-label">Customer ID:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="Ma_khach_hang"
                  name="Ma_khach_hang"
                  value={customer.Ma_khach_hang}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="Ho_ten_dem" className="col-md-4 col-form-label">First Name:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="Ho_ten_dem"
                  name="Ho_ten_dem"
                  value={customer.Ho_ten_dem}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="Ten" className="col-md-4 col-form-label">Last Name:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="Ten"
                  name="Ten"
                  value={customer.Ten}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="SDT" className="col-md-4 col-form-label">Phone Number:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="SDT"
                  name="SDT"
                  value={customer.SDT}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="Email" className="col-md-4 col-form-label">Email:</label>
              <div className="col-md-8">
                <input
                  type="email"
                  className="form-control"
                  id="Email"
                  name="Email"
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
