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
        console.log(data);  // Kiểm tra xem API trả về dữ liệu đúng không
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

    // Gửi yêu cầu PUT để cập nhật thông tin khách hàng
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
        alert('Cập nhật khách hàng thành công!');
        navigate('/customers'); // Điều hướng về danh sách khách hàng sau khi cập nhật
      } else {
        alert(data.message || 'Có lỗi xảy ra khi cập nhật khách hàng.');
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      alert('Không thể kết nối tới máy chủ.');
    }
  };

  const handleCancel = () => {
    navigate('/customers'); // Trở về danh sách khách hàng mà không thay đổi gì
  };

  return (
    <div className="container mt-5">
      <h2>Cập nhật thông tin Khách Hàng</h2>
      {/* Form nhập thông tin khách hàng */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ma_khach_hang:</label>
          <input
            type="text"
            className="form-control"
            name="Ma_khach_hang"
            value={customer.Ma_khach_hang}
            onChange={handleChange}
            disabled
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
        <div className="mt-3">
          <button type="submit" className="btn btn-primary">
            Cập nhật khách hàng
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

export default UpdateCustomer;
