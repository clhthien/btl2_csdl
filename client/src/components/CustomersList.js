import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {FaEdit, FaTrash} from 'react-icons/fa';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/khachhang')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
        setLoading(false);
      });
  }, []);

  const deleteCustomer = (ma_khach_hang) => {
    fetch(process.env.REACT_APP_API_URL + '/khachhang/' + ma_khach_hang, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message); // Hiển thị thông báo khi xóa thành công
        }
        setCustomers(customers.filter(customer => customer.Ma_khach_hang !== ma_khach_hang)); // Cập nhật lại danh sách khách hàng
      })
      .catch((error) => console.error('Error deleting customer:', error));
  };

  const updateCustomer = (ma_khach_hang) => {
    navigate(`/customers/update/${ma_khach_hang}`); // Điều hướng tới trang UpdateCustomer với id của khách hàng
  };

  return (
    <div className="container mt-5">
      <h1>Danh sách Khách Hàng</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Ma_khach_hang</th>
              <th>Họ và tên đệm</th>
              <th>Tên</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="6">Không có khách hàng nào.</td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.Ma_khach_hang}>
                  <td>{customer.Ma_khach_hang}</td>
                  <td>{customer.Ho_ten_dem}</td>
                  <td>{customer.Ten}</td>
                  <td>{customer.SDT}</td>
                  <td>{customer.Email}</td>
                  <td>
                    <button className="btn btn-warning mr-2" style={{marginRight:'10px'}} onClick={() => updateCustomer(customer.Ma_khach_hang)}><FaEdit/></button>
                    <button className="btn btn-danger" onClick={() => deleteCustomer(customer.Ma_khach_hang)}><FaTrash/></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomersList;
