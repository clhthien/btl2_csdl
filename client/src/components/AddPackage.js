import React, { useState } from 'react';

const AddPackage = () => {
  const [pkg, setPkg] = useState({
    Ma_goi: '',
    Ten_goi: '',
    Gia: '',
    Khoi_luong: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPkg({
      ...pkg,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pkg.Ma_goi || !pkg.Ten_goi || !pkg.Gia || !pkg.Khoi_luong) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/kienhang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pkg),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Thêm gói hàng thành công!');
        setPkg({
          Ma_goi: '',
          Ten_goi: '',
          Gia: '',
          Khoi_luong: ''
        });
      } else {
        alert(data.message || 'Có lỗi xảy ra khi thêm gói hàng.');
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      alert('Không thể kết nối tới máy chủ.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Thêm Gói Hàng</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ma_goi:</label>
          <input
            type="text"
            className="form-control"
            name="Ma_goi"
            value={pkg.Ma_goi}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Tên gói:</label>
          <input
            type="text"
            className="form-control"
            name="Ten_goi"
            value={pkg.Ten_goi}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Giá:</label>
          <input
            type="number"
            className="form-control"
            name="Gia"
            value={pkg.Gia}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Khối lượng:</label>
          <input
            type="number"
            className="form-control"
            name="Khoi_luong"
            value={pkg.Khoi_luong}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Thêm Gói</button>
      </form>
    </div>
  );
};

export default AddPackage;
