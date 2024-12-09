import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSort } from 'react-icons/fa';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrderMaDDH, setSortOrderMaDDH] = useState('asc');
  const [sortOrderMaKH, setSortOrderMaKH] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/dondathang')
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
    fetch(`${process.env.REACT_APP_API_URL}/dondathang/${orderId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message); // Show success message when deleted
        }
        setOrders(orders.filter(order => order.Ma_ddh !== orderId)); // Update order list
        setShowConfirmModal(false); // Close modal after deleting
      })
      .catch((error) => console.error('Error deleting order:', error));
  };

  const updateOrder = (orderId) => {
    navigate(`/orders/update/${orderId}`); // Navigate to UpdateOrder page
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handleSort = (field, sortOrder) => {
    const sortedOrders = [...orders].sort((a, b) => {
      if (a[field] < b[field]) return sortOrder === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setOrders(sortedOrders);
  };

  // Filter orders by order ID or customer ID
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

  // Calculate total pages
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="container mt-5">
      <h1>Order List</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search orders by Order ID or Customer ID"
          value={searchQuery}
          onChange={handleSearch}
          style={{ width: '31%' }}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>
                Order ID
                <button
                  className="btn btn-link"
                  onClick={() => {
                    const newOrder = sortOrderMaDDH === 'asc' ? 'desc' : 'asc';
                    setSortOrderMaDDH(newOrder);
                    handleSort('Ma_ddh', newOrder);
                  }}
                >
                  <FaSort />
                </button>
              </th>
              <th>
                Customer ID
                <button
                  className="btn btn-link"
                  onClick={() => {
                    const newOrder = sortOrderMaKH === 'asc' ? 'desc' : 'asc';
                    setSortOrderMaKH(newOrder);
                    handleSort('Ma_khach_hang', newOrder);
                  }}
                >
                  <FaSort />
                </button>
              </th>
              <th>Sender Phone</th>
              <th>Receiver Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length === 0 ? (
              <tr>
                <td colSpan="5">No orders found.</td>
              </tr>
            ) : (
              currentOrders.map((order) => (
                <tr key={order.Ma_ddh}>
                  <td>{order.Ma_ddh}</td>
                  <td>{order.Ma_khach_hang}</td>
                  <td>{order.Sdt_nguoi_gui}</td>
                  <td>{order.Sdt_nguoi_nhan}</td>
                  <td>
                    <button className="btn btn-warning mr-2" onClick={() => updateOrder(order.Ma_ddh)}>
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setOrderToDelete(order.Ma_ddh);
                        setShowConfirmModal(true); // Show delete confirmation modal
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <nav>
        <ul className="pagination">
          <li
            className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => currentPage > 1 && paginate(currentPage - 1)} // Disable "Prev" if on the first page
            style={{ cursor: 'pointer' }}
          >
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
          <li
            className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => currentPage < totalPages && paginate(currentPage + 1)} // Disable "Next" if on the last page
            style={{ cursor: 'pointer' }}
          >
            <span className="page-link">Next</span>
          </li>
        </ul>
      </nav>

      {/* Modal Confirm Delete */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Delete</h5>
              <button
                type="button"
                className="close"
                onClick={() => setShowConfirmModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this order?</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => deleteOrder(orderToDelete)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
