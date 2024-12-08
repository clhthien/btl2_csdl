import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateWarehouse = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState({
    Ma_kho: '',
    Dia_chi: '',
    Suc_chua: ''
  });

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/khohang/' + id)
      .then((response) => response.json())
      .then((data) => setWarehouse(data))
      .catch((error) => console.error('Error fetching warehouse:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWarehouse({
      ...warehouse,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!warehouse.Ma_kho || !warehouse.Dia_chi || !warehouse.Suc_chua) {
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
        navigate('/warehouses');
      } else {
        alert(data.message || 'Có lỗi xảy ra khi cập nhật kho hàng.');
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      alert('Không thể kết nối tới máy chủ.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Cập nhật Kho Hàng</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Mã Kho:</label>
          <input
            type="text"
            className="form-control"
            name="Ma_kho"
            value={warehouse.Ma_kho}
            onChange={handleChange}
            disabled
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
        <button type="submit" className="btn btn-primary">Cập nhật Kho</button>
      </form>
    </div>
  );
};

export default UpdateWarehouse;
