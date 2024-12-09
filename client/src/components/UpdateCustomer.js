import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    Ma_khach_hang: '',
    Ho_ten_dem: '',
    Ten: '',
    SDT: '',
    Email: ''
  });

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/khachhang/' + id)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);  // Check if the API returns the correct data
        setCustomer(data);
      })
      .catch((error) => console.error('Error fetching customer:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({
      ...customer,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send PUT request to update customer information
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/khachhang/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Customer updated successfully!');
        navigate('/customers'); // Navigate to the customer list after updating
      } else {
        alert(data.message || 'An error occurred while updating the customer.');
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Could not connect to the server.');
    }
  };

  const handleCancel = () => {
    navigate('/customers'); // Go back to the customer list without making changes
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4" style={{ width: '600px' }}>
        <h2 className="text-center mb-4">Update Customer Information</h2>
        {/* Customer information form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group row">
            <label htmlFor="customerId" className="col-sm-4 col-form-label">Customer ID:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                id="customerId"
                name="Ma_khach_hang"
                value={customer.Ma_khach_hang}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="firstName" className="col-sm-4 col-form-label">First Name:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                id="firstName"
                name="Ho_ten_dem"
                value={customer.Ho_ten_dem}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="lastName" className="col-sm-4 col-form-label">Last Name:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="Ten"
                value={customer.Ten}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="phone" className="col-sm-4 col-form-label">Phone Number:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                id="phone"
                name="SDT"
                value={customer.SDT}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="email" className="col-sm-4 col-form-label">Email:</label>
            <div className="col-sm-8">
              <input
                type="email"
                className="form-control"
                id="email"
                name="Email"
                value={customer.Email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mt-3 d-flex justify-content-center">
            <button type="submit" className="btn btn-primary me-2">
              Update Customer
            </button>
            <button
              type="submit"
              className="btn btn-secondary ms-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateCustomer;
