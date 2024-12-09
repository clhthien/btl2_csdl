import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateWarehouse = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState({
    Ma_kho: '',
    Dia_chi: '',
    Suc_chua_toi_da: '',
    So_luong_kien_hang: ''
  });

  // Lấy thông tin kho hàng từ API
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/khohang/' + id)
      .then((response) => response.json())
      .then((data) => setWarehouse(data))
      .catch((error) => console.error('Error fetching warehouse:', error));
  }, [id]);

  // Xử lý thay đổi giá trị input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setWarehouse({
      ...warehouse,
      [name]: value
    });
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra thông tin nhập vào
    if (!warehouse.Ma_kho || !warehouse.Dia_chi || !warehouse.Suc_chua_toi_da || !warehouse.So_luong_kien_hang) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/khohang/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(warehouse),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Cập nhật kho hàng thành công!');
        navigate('/warehouses'); // Điều hướng về danh sách kho hàng sau khi cập nhật
      } else {
        alert(data.message || 'Có lỗi xảy ra khi cập nhật kho hàng.');
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      alert('Không thể kết nối tới máy chủ.');
    }
  };

  // Xử lý hủy bỏ và quay lại trang danh sách kho hàng
  const handleCancel = () => {
    navigate('/warehouses'); // Quay lại danh sách kho hàng
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4" style={{ width: '600px' }}>
        <h2 className="text-center mb-4">Update Warehouse</h2> {/* Tiêu đề cập nhật kho hàng */}
        <form onSubmit={handleSubmit}>
          {/* Mã kho (không thể sửa) */}
          <div className="form-group row">
            <label htmlFor="warehouseId" className="col-sm-4 col-form-label">Warehouse ID:</label> {/* Mã kho */}
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                id="warehouseId"
                name="Ma_kho"
                value={warehouse.Ma_kho}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="form-group row">
            <label htmlFor="address" className="col-sm-4 col-form-label">Address:</label> {/* Địa chỉ */}
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                id="address"
                name="Dia_chi"
                value={warehouse.Dia_chi}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Sức chứa */}
          <div className="form-group row">
            <label htmlFor="capacity" className="col-sm-4 col-form-label">Storage Capacity:</label> {/* Sức chứa */}
            <div className="col-sm-8">
              <input
                type="number"
                className="form-control"
                id="capacity"
                name="Suc_chua_toi_da"
                value={warehouse.Suc_chua_toi_da}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Số lượng kiện hàng */}
          <div className="form-group row">
            <label htmlFor="itemCount" className="col-sm-4 col-form-label">Number of Packages:</label> {/* Số lượng kiện hàng */}
            <div className="col-sm-8">
              <input
                type="number"
                className="form-control"
                id="itemCount"
                name="So_luong_kien_hang"
                value={warehouse.So_luong_kien_hang}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Các nút cập nhật và hủy */}
          <div className="mt-3 d-flex justify-content-center">
            <button type="submit" className="btn btn-primary me-2">
              Update Warehouse {/* Nút cập nhật kho */}
            </button>
            <button
              type="submit"
              className="btn btn-secondary ms-2"
              onClick={handleCancel}
            >
              Cancel {/* Nút hủy */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateWarehouse;
