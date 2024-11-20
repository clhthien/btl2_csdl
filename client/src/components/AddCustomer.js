import React, { useState } from 'react';

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
      alert('Vui lòng điền đầy đủ thông tin.');
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
        alert('Thêm khách hàng thành công!');
        setCustomer({
          Ma_khach_hang: '',
          Ho_ten_dem: '',
          Ten: '',
          SDT: '',
          Email: ''
        });
      } else {
        alert(data.message || 'Có lỗi xảy ra khi thêm khách hàng.');
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      alert('Không thể kết nối tới máy chủ.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Thêm Khách Hàng</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ma_khach_hang:</label>
          <input
            type="text"
            className="form-control"
            name="Ma_khach_hang"
            value={customer.Ma_khach_hang}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Họ và tên đệm:</label>
          <input
            type="text"
            className="form-control"
            name="Ho_ten_dem"
            value={customer.Ho_ten_dem}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Tên:</label>
          <input
            type="text"
            className="form-control"
            name="Ten"
            value={customer.Ten}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại:</label>
          <input
            type="text"
            className="form-control"
            name="SDT"
            value={customer.SDT}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            name="Email"
            value={customer.Email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Thêm khách hàng</button>
      </form>
    </div>
  );
};

export default AddCustomer;
