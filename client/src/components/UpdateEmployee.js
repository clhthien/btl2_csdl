import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateEmployee = () => {
  const { id } = useParams(); // Lấy ID của nhân viên từ URL
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    Ma_nv: '',
    Ho_ten_dem: '',
    Ten: '',
    SDT: '',
    Ngay_sinh: '',
    Loai_nhan_vien: 'bao_tri', // Loại nhân viên mặc định là bảo trì
    Bao_tri: '', // Thông tin bảo trì
    Giao_hang: {
      bang_lai: '', // Bằng lái
      phuong_tien: '' // Phương tiện
    },
    Van_phong: {
      dia_chi: '', // Địa chỉ văn phòng
      email: '' // Email văn phòng
    }
  });

  // Tải dữ liệu nhân viên khi component được render lần đầu
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/nhanvien/' + id)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Kiểm tra dữ liệu nhận được
        setEmployee(data);
      })
      .catch((error) => console.error('Error fetching employee:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value
    });
  };

  // Hàm gửi yêu cầu cập nhật thông tin nhân viên
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/nhanvien/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Cập nhật nhân viên thành công!');
        navigate('/employees'); // Điều hướng về danh sách nhân viên sau khi cập nhật
      } else {
        alert(data.message || 'Có lỗi xảy ra khi cập nhật nhân viên.');
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      alert('Không thể kết nối tới máy chủ.');
    }
  };

  const handleCancel = () => {
    navigate('/employees'); // Trở về danh sách nhân viên mà không thay đổi gì
  };

  return (
    <div className="container mt-5">
      <h2>Cập nhật thông tin Nhân Viên</h2>
      <form onSubmit={handleSubmit}>
        {/* Các trường thông tin chung */}
        <div className="form-group">
          <label>Ma_nv:</label>
          <input
            type="text"
            className="form-control"
            name="Ma_nv"
            value={employee.Ma_nv}
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
            value={employee.Ho_ten_dem}
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
            value={employee.Ten}
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
            value={employee.SDT}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Ngày sinh:</label>
          <input
            type="date"
            className="form-control"
            name="Ngay_sinh"
            value={employee.Ngay_sinh}
            onChange={handleChange}
            required
          />
        </div>

        {/* Chọn loại nhân viên */}
        <div className="form-group">
          <label>Loại nhân viên:</label>
          <select
            className="form-control"
            name="Loai_nhan_vien"
            value={employee.Loai_nhan_vien}
            onChange={handleChange}
            required
          >
            <option value="bao_tri">Nhân viên bảo trì</option>
            <option value="giao_hang">Nhân viên giao hàng</option>
            <option value="van_phong">Nhân viên văn phòng</option>
          </select>
        </div>

        {/* Các thông tin riêng cho từng loại nhân viên */}
        {employee.Loai_nhan_vien === 'bao_tri' && (
          <div className="form-group">
            <label>Địa chỉ làm việc:</label>
            <input
              type="text"
              className="form-control"
              name="Bao_tri"
              value={employee.Bao_tri}
              onChange={handleChange}
            />
          </div>
        )}

        {employee.Loai_nhan_vien === 'giao_hang' && (
          <>
            <div className="form-group">
              <label>Bằng lái:</label>
              <input
                type="text"
                className="form-control"
                name="Giao_hang.bang_lai"
                value={employee.Giao_hang.bang_lai}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Phương tiện:</label>
              <input
                type="text"
                className="form-control"
                name="Giao_hang.phuong_tien"
                value={employee.Giao_hang.phuong_tien}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {employee.Loai_nhan_vien === 'van_phong' && (
          <>
            <div className="form-group">
              <label>Địa chỉ văn phòng:</label>
              <input
                type="text"
                className="form-control"
                name="Van_phong.dia_chi"
                value={employee.Van_phong.dia_chi}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                className="form-control"
                name="Van_phong.email"
                value={employee.Van_phong.email}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <div className="mt-3">
          <button type="submit" className="btn btn-primary">
            Cập nhật nhân viên
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

export default UpdateEmployee;
