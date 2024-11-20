import React, { useState, useEffect } from 'react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm state để quản lý trạng thái loading

  useEffect(() => {
    fetch('http://localhost:3001/api/khachhang')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched Data:', data);
        setCustomers(data);
        setLoading(false);  // Đánh dấu là đã xong việc load dữ liệu
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
        setLoading(false);  // Nếu có lỗi, cũng đánh dấu là xong việc load
      });
  }, []);

  return (
    <div className="container mt-5">
      <h1>Danh sách Khách Hàng</h1>
      {loading ? (
        <p>Loading...</p> // Hiển thị trạng thái loading
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Ma_khach_hang</th>
              <th>Họ và tên đệm</th>
              <th>Tên</th>
              <th>Số điện thoại</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="5">Không có khách hàng nào.</td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.Ma_khach_hang}>
                  <td>{customer.Ma_khach_hang}</td>
                  <td>{customer.Ho_ten_dem}</td>
                  <td>{customer.Ten}</td>
                  <td>{customer.SDT}</td>
                  <td>{customer.Email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Customers;
