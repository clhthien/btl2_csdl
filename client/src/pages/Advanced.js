import React, { useState } from 'react';

const Advanced = () => {
  // Trạng thái cho tính năng Tìm Kiếm Kiện Hàng
  const [soLuong, setSoLuong] = useState(null);
  const [loadingItemCount, setLoadingItemCount] = useState(false);
  const [errorItemCount, setErrorItemCount] = useState(null);

  // Trạng thái cho tính năng Tính Tổng Giá Trị Kiện Hàng
  const [tongGiaTri, setTongGiaTri] = useState(null);
  const [loadingTotalValue, setLoadingTotalValue] = useState(false);
  const [errorTotalValue, setErrorTotalValue] = useState(null);

  const [maKho, setMaKho] = useState('');
  const [loaiHang, setLoaiHang] = useState('');
  const [maKhachHang, setMaKhachHang] = useState('');

  // Hàm gọi API để lấy số lượng
  const fetchItemCount = async () => {
    if (!maKho || !loaiHang) {
      alert("Vui lòng nhập đầy đủ thông tin Mã kho và Loại hàng!");
      return;
    }

    setLoadingItemCount(true);
    setErrorItemCount(null);

    try {
      const response = await fetch(`http://localhost:3001/api/nangcao/count-items/${maKho}/${loaiHang}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi lấy dữ liệu');
      }

      const data = await response.json();
      setSoLuong(data.SoLuong);
    } catch (err) {
      setErrorItemCount(err.message);
    } finally {
      setLoadingItemCount(false);
    }
  };

  // Hàm gọi API để tính tổng giá trị kiện hàng theo khách hàng
  const fetchTotalValue = async () => {
    if (!maKhachHang) {
      alert("Vui lòng nhập mã khách hàng!");
      return;
    }

    setLoadingTotalValue(true);
    setErrorTotalValue(null);

    try {
      const response = await fetch(`http://localhost:3001/api/nangcao/total-value/${maKhachHang}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi lấy dữ liệu');
      }

      const data = await response.json();
      setTongGiaTri(data.TongGiaTri);
    } catch (err) {
      setErrorTotalValue(err.message);
    } finally {
      setLoadingTotalValue(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Tìm Kiếm Nâng Cao</h2>
      
      <div className="row">
        {/* Cột bên trái: Tính năng tìm kiếm số lượng */}
        <div className="col-md-6">
          <div className="card p-4 mb-4">
            <h4 className="mb-5">Số Lượng Kiện Hàng Trong Kho Hàng</h4>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                fetchItemCount(); 
              }}
            >
              <div className="mb-3 text-center">
                <label className="form-label">Mã Kho:</label>
                <input
                  type="text"
                  className="form-control mx-auto"
                  value={maKho}
                  onChange={(e) => setMaKho(e.target.value)}
                  placeholder="Nhập Mã Kho"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Loại Hàng:</label>
                <select
                  className="form-select w-auto mx-auto"
                  value={loaiHang}
                  onChange={(e) => setLoaiHang(e.target.value)}
                  required
                >
                  <option value="">Chọn Loại Hàng</option>
                  <option value="Thường">Thường</option>
                  <option value="Dễ vỡ">Dễ vỡ</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary">Tìm Kiếm</button>
            </form>

            {loadingItemCount && <div className="mt-3">Loading...</div>}
            {errorItemCount && <div className="mt-3 text-danger">Error: {errorItemCount}</div>}
            {soLuong !== null && !loadingItemCount && !errorItemCount && (
              <div className="mt-3">
                <p className="fw-bold" style={{ fontSize: '1.2rem' }}>Số lượng kiện hàng:</p>
                <p className="display-4 text-success">{soLuong}</p>
              </div>
            )}
          </div>
        </div>

        {/* Cột bên phải: Tính năng tính tổng giá trị kiện hàng theo khách hàng */}
        <div className="col-md-6">
          <div className="card p-4 mb-4">
            <h4 className="mb-5">Tổng Giá Trị Kiện Hàng Của Khách Hàng</h4>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                fetchTotalValue(); 
              }}
            >
              <div className="mb-3">
                <label className="form-label">Mã Khách Hàng:</label>
                <input
                  type="text"
                  className="form-control mx-auto"
                  value={maKhachHang}
                  onChange={(e) => setMaKhachHang(e.target.value)}
                  placeholder="Nhập Mã Khách Hàng"
                  required
                />
              </div>

              <button type="submit" className="btn btn-success">Tính Tổng Giá Trị</button>
            </form>

            {loadingTotalValue && <div className="mt-3">Loading...</div>}
            {errorTotalValue && <div className="mt-3 text-danger">Error: {errorTotalValue}</div>}
            {tongGiaTri !== null && !loadingTotalValue && !errorTotalValue && (
              <div className="mt-3">
                <p className="fw-bold" style={{ fontSize: '1.2rem' }}>Tổng giá trị kiện hàng:</p>
                <p className="display-4 text-success">{tongGiaTri}</p> {/* Làm nổi bật số lượng */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advanced;
