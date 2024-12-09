import React, { useState } from 'react';
import './AddCustomer.css';

const AddOrder = () => {
  const [order, setOrder] = useState({
    Ma_ddh: '',
    Sdt_nguoi_gui: '',
    Sdt_nguoi_nhan: '',
    Ma_khach_hang: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder({
      ...order,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!order.Ma_ddh || !order.Sdt_nguoi_gui || !order.Sdt_nguoi_nhan || !order.Ma_khach_hang) {
      alert('Please fill in all the fields.');
      return;
    }

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/dondathang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Order added successfully!');
        setOrder({
          Ma_ddh: '',
          Sdt_nguoi_gui: '',
          Sdt_nguoi_nhan: '',
          Ma_khach_hang: ''
        });
      } else {
        alert(data.message || 'Error occurred while adding the order.');
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Unable to connect to the server.');
    }
  };

  return (
    <div className="container-fluid mt-5">
      <h2 className="text-center mb-4">Add Order</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form onSubmit={handleSubmit} className="shadow-lg p-4 rounded border">
            <div className="form-group row mb-3">
              <label htmlFor="Ma_ddh" className="col-md-4 col-form-label">Order ID:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="Ma_ddh"
                  name="Ma_ddh"
                  value={order.Ma_ddh}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group row mb-3">
              <label htmlFor="Sdt_nguoi_gui" className="col-md-4 col-form-label">Sender's Phone:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="Sdt_nguoi_gui"
                  name="Sdt_nguoi_gui"
                  value={order.Sdt_nguoi_gui}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group row mb-3">
              <label htmlFor="Sdt_nguoi_nhan" className="col-md-4 col-form-label">Recipient's Phone:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="Sdt_nguoi_nhan"
                  name="Sdt_nguoi_nhan"
                  value={order.Sdt_nguoi_nhan}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group row mb-3">
              <label htmlFor="Ma_khach_hang" className="col-md-4 col-form-label">Customer ID:</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  id="Ma_khach_hang"
                  name="Ma_khach_hang"
                  value={order.Ma_khach_hang}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block mt-4">Add Order</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOrder;
