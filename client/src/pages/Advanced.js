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
      alert("Please enter complete information for Warehouse ID and Item Type!");
      return;
    }

    setLoadingItemCount(true);
    setErrorItemCount(null);

    try {
      const response = await fetch(`http://localhost:3001/api/nangcao/count-items/${maKho}/${loaiHang}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching data!');
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
      alert("Please enter the customer ID!");
      return;
    }

    setLoadingTotalValue(true);
    setErrorTotalValue(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/nangcao/total-value/${maKhachHang}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching data');
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
      <h2 className="mb-4">Advanced Search</h2>
      
      <div className="row">
        {/* Cột bên trái: Tính năng tìm kiếm số lượng */}
        <div className="col-md-6">
          <div className="card p-4 mb-4">
            <h4 className="mb-5">Quantity of Packages in the Warehouse</h4>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                fetchItemCount(); 
              }}
            >
              <div className="mb-3 text-center">
                <label className="form-label">Warehouse ID:</label>
                <input
                  type="text"
                  className="form-control mx-auto"
                  value={maKho}
                  onChange={(e) => setMaKho(e.target.value)}
                  placeholder="Enter Warehouse ID"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Package Type:</label>
                <select
                  className="form-select w-auto mx-auto"
                  value={loaiHang}
                  onChange={(e) => setLoaiHang(e.target.value)}
                  required
                >
                  <option value="">Select Item Type</option>
                  <option value="Thường">Thường</option>
                  <option value="Dễ vỡ">Dễ vỡ </option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary">Search</button>
            </form>

            {loadingItemCount && <div className="mt-3">Loading...</div>}
            {errorItemCount && <div className="mt-3 text-danger">Error: {errorItemCount}</div>}
            {soLuong !== null && !loadingItemCount && !errorItemCount && (
              <div className="mt-3">
                <p className="fw-bold" style={{ fontSize: '1.2rem' }}>Number of packages:</p>
                <p className="display-4 text-success">{soLuong}</p>
              </div>
            )}
          </div>
        </div>

        {/* Cột bên phải: Tính năng tính tổng giá trị kiện hàng theo khách hàng */}
        <div className="col-md-6">
          <div className="card p-4 mb-4">
            <h4 className="mb-5">Total Value of Customer's Packages</h4>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                fetchTotalValue(); 
              }}
            >
              <div className="mb-3">
                <label className="form-label">Customer ID:</label>
                <input
                  type="text"
                  className="form-control mx-auto"
                  value={maKhachHang}
                  onChange={(e) => setMaKhachHang(e.target.value)}
                  placeholder="Enter Customer ID"
                  required
                />
              </div>

              <button type="submit" className="btn btn-success">Calculate Total Value</button>
            </form>

            {loadingTotalValue && <div className="mt-3">Loading...</div>}
            {errorTotalValue && <div className="mt-3 text-danger">Error: {errorTotalValue}</div>}
            {tongGiaTri !== null && !loadingTotalValue && !errorTotalValue && (
              <div className="mt-3">
                <p className="fw-bold" style={{ fontSize: '1.2rem' }}>Total Package Value:</p>
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
