import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5); // Số đơn đặt hàng mỗi trang
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/dondathang')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        setLoading(false);
      });
  }, []);

  const deleteOrder = (orderId) => {
    fetch(`http://localhost:3001/api/dondathang/${orderId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message); // Hiển thị thông báo khi xóa thành công
        }
        setOrders(orders.filter(order => order.Ma_ddh !== orderId)); // Cập nhật lại danh sách đơn hàng
      })
      .catch((error) => console.error('Error deleting order:', error));
  };

  const updateOrder = (orderId) => {
    navigate(`/orders/update/${orderId}`); // Điều hướng tới trang UpdateOrder với id của đơn hàng
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Khi tìm kiếm, quay về trang đầu
  };

  const handleSort = (field) => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    const sortedOrders = [...orders].sort((a, b) => {
      if (a[field] < b[field]) return newSortOrder === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return newSortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setOrders(sortedOrders);
  };

  // Lọc đơn hàng theo mã đơn hàng hoặc mã khách hàng
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      order.Ma_ddh.toLowerCase().includes(searchLower) || order.Ma_khach_hang.toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Tính toán tổng số trang
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="container mt-5">
      <h1>Danh sách Đơn Đặt Hàng</h1>
      
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm đơn hàng theo mã đơn hoặc mã khách hàng"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>
                <button className="btn btn-link" onClick={() => handleSort('Ma_ddh')}>
                  Mã đơn hàng {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </th>
              <th>
                <button className="btn btn-link" onClick={() => handleSort('Ma_khach_hang')}>
                  Mã khách hàng {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </th>
              <th>Số điện thoại người gửi</th>
              <th>Số điện thoại người nhận</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length === 0 ? (
              <tr>
                <td colSpan="5">Không có đơn hàng nào.</td>
              </tr>
            ) : (
              currentOrders.map((order) => (
                <tr key={order.Ma_ddh}>
                  <td>{order.Ma_ddh}</td>
                  <td>{order.Ma_khach_hang}</td>
                  <td>{order.Sdt_nguoi_gui}</td>
                  <td>{order.Sdt_nguoi_nhan}</td>
                  <td>
                    <button className="btn btn-warning mr-2" style={{ marginRight: '10px' }} onClick={() => updateOrder(order.Ma_ddh)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-danger" onClick={() => deleteOrder(order.Ma_ddh)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Phân trang */}
      <nav>
        <ul className="pagination">
          <li className="page-item" onClick={() => paginate(currentPage - 1)} style={{ cursor: 'pointer' }} disabled={currentPage === 1}>
            <span className="page-link">Prev</span>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => paginate(index + 1)}
              style={{ cursor: 'pointer' }}
            >
              <span className="page-link">{index + 1}</span>
            </li>
          ))}
          <li className="page-item" onClick={() => paginate(currentPage + 1)} style={{ cursor: 'pointer' }} disabled={currentPage === totalPages}>
            <span className="page-link">Next</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default OrdersList;
