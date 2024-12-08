import React, { useState } from 'react';

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
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      const response = await fetch(process.env.REACT_APP_API_URL+'/dondathang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Thêm đơn đặt hàng thành công!');
        setOrder({
          Ma_ddh: '',
          Sdt_nguoi_gui: '',
          Sdt_nguoi_nhan: '',
          Ma_khach_hang: ''
        });
      } else {
        alert(data.message || 'Có lỗi xảy ra khi thêm đơn đặt hàng.');
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      alert('Không thể kết nối tới máy chủ.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Thêm Đơn Đặt Hàng</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Mã đơn hàng:</label>
          <input
            type="text"
            className="form-control"
            name="Ma_ddh"
            value={order.Ma_ddh}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại người gửi:</label>
          <input
            type="text"
            className="form-control"
            name="Sdt_nguoi_gui"
            value={order.Sdt_nguoi_gui}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại người nhận:</label>
          <input
            type="text"
            className="form-control"
            name="Sdt_nguoi_nhan"
            value={order.Sdt_nguoi_nhan}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Mã khách hàng:</label>
          <input
            type="text"
            className="form-control"
            name="Ma_khach_hang"
            value={order.Ma_khach_hang}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Thêm đơn đặt hàng</button>
      </form>
    </div>
  );
};

export default AddOrder;
