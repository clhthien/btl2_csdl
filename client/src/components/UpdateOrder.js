import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateOrder = () => {
  const { id } = useParams(); // Get the order ID from the URL
  const navigate = useNavigate(); // For navigation after submission
  const [order, setOrder] = useState({
    Ma_ddh: '',
    Sdt_nguoi_gui: '',
    Sdt_nguoi_nhan: '',
    Ma_khach_hang: ''
  });

  // Fetch order details when the component mounts
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/dondathang/' + id)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Check if the API returns the correct data
        setOrder(data);
      })
      .catch((error) => console.error('Error fetching order:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder({
      ...order,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send PUT request to update the order
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/dondathang/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Order updated successfully!');
        navigate('/orders'); // Navigate to the orders list after updating
      } else {
        alert(data.message || 'An error occurred while updating the order.');
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Could not connect to the server.');
    }
  };

  const handleCancel = () => {
    navigate('/orders'); // Navigate back to the orders list without saving
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4" style={{ width: '600px' }}>
        <h2 className="text-center mb-4">Update Order Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group row">
            <label htmlFor="customerId" className="col-sm-5 col-form-label">Order ID:</label>
            <div className="col-sm-7">
              <input
                type="text"
                className="form-control"
                name="Ma_ddh"
                value={order.Ma_ddh}
                onChange={handleChange}
                disabled // Disable the order ID field
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-5 col-form-label">Sender's Phone Number:</label>
            <div className="col-sm-7">
              <input
                type="text"
                className="form-control"
                name="Sdt_nguoi_gui"
                value={order.Sdt_nguoi_gui}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-5 col-form-label">Receiver's Phone Number:</label>
            <div className="col-sm-7">
              <input
                type="text"
                className="form-control"
                name="Sdt_nguoi_nhan"
                value={order.Sdt_nguoi_nhan}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-5 col-form-label">Customer ID:</label>
            <div className="col-sm-7">
              <input
                type="text"
                className="form-control"
                name="Ma_khach_hang"
                value={order.Ma_khach_hang}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mt-3 d-flex justify-content-center">
            <button type="submit" className="btn btn-primary me-2">
              Update Order
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

export default UpdateOrder;
