import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateOrder = () => {
  const { id } = useParams(); // Lấy id từ URL (Mã đơn đặt hàng)
  const navigate = useNavigate(); // Điều hướng trang
  const [order, setOrder] = useState({
    Ma_ddh: '',
    Sdt_nguoi_gui: '',
    Sdt_nguoi_nhan: '',
    Ma_khach_hang: ''
  });

  useEffect(() => {
    // Fetch thông tin đơn đặt hàng từ API
    fetch(process.env.REACT_APP_API_URL + '/dondathang/' + id)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Kiểm tra dữ liệu từ API
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

    // Gửi yêu cầu PUT để cập nhật thông tin đơn đặt hàng
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
        alert('Cập nhật đơn đặt hàng thành công!');
        navigate('/orders'); // Điều hướng về danh sách đơn đặt hàng sau khi cập nhật
      } else {
        alert(data.message || 'Có lỗi xảy ra khi cập nhật đơn đặt hàng.');
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      alert('Không thể kết nối tới máy chủ.');
    }
  };

  const handleCancel = () => {
    navigate('/orders'); // Trở về danh sách đơn đặt hàng mà không thay đổi gì
  };

  return (
    <div className="container mt-5">
      <h2>Cập nhật thông tin Đơn Đặt Hàng</h2>
      {/* Form nhập thông tin đơn đặt hàng */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ma_ddh:</label>
          <input
            type="text"
            className="form-control"
            name="Ma_ddh"
            value={order.Ma_ddh}
            onChange={handleChange}
            disabled
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
        <div className="mt-3">
          <button type="submit" className="btn btn-primary">
            Cập nhật đơn đặt hàng
          </button>
          <button
            type="button"
            className="btn btn-secondary ml-3"
            onClick={handleCancel}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateOrder;
