import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddWarehouse = () => {
  const [warehouse, setWarehouse] = useState({
    Ma_kho: '',
    Dia_chi: '',
    Suc_chua: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWarehouse({
      ...warehouse,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/khohang`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(warehouse),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Tạo kho hàng thành công!');
        navigate('/warehouses'); // Điều hướng về danh sách kho hàng
      } else {
        alert(data.message || 'Có lỗi xảy ra khi tạo kho hàng.');
      }
    } catch (error) {
      console.error('Lỗi khi tạo kho hàng:', error);
      alert('Không thể kết nối đến máy chủ.');
    }
  };

  const handleCancel = () => {
    navigate('/warehouses'); // Trở lại danh sách kho hàng mà không lưu thay đổi
  };

  return (
    <div className="container mt-5">
      <h2>Thêm Kho Hàng</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ma Kho:</label>
          <input
            type="text"
            className="form-control"
            name="Ma_kho"
            value={warehouse.Ma_kho}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Địa Chỉ:</label>
          <input
            type="text"
            className="form-control"
            name="Dia_chi"
            value={warehouse.Dia_chi}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Sức Chứa:</label>
          <input
            type="number"
            className="form-control"
            name="Suc_chua"
            value={warehouse.Suc_chua}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mt-3">
          <button type="submit" className="btn btn-primary">
            Lưu Kho Hàng
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

export default AddWarehouse;
