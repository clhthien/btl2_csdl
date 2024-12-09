import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSort } from 'react-icons/fa';
//import './WarehousesList.css';

const WarehousesList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortWarehouseID, setSortWarehouseID] = useState('asc');
  const [sortWarehouseAddress, setSortWarehouseAddress] = useState('asc');
  const [sortWarehouseMax, setSortWarehouseMax] = useState('asc');
  const [sortWarehouseNumber, setSortWarehouseNumber] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [warehousesPerPage] = useState(5);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/khohang')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setWarehouses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching warehouses:', error);
        setLoading(false);
      });
  }, []);

  const deleteWarehouse = (warehouseId) => {
    fetch(`${process.env.REACT_APP_API_URL}/khohang/${warehouseId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message); // Show success message when deleted
        }
        setWarehouses(warehouses.filter(warehouse => warehouse.Ma_kho !== warehouseId)); // Update warehouse list
        setShowConfirmModal(false); // Close modal after deletion
      })
      .catch((error) => console.error('Error deleting warehouse:', error));
  };

  const updateWarehouse = (warehouseId) => {
    navigate(`/warehouses/update/${warehouseId}`); // Navigate to UpdateWarehouse page
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handleSort = (field, sortOrder) => {
    const sortedWarehouses = [...warehouses].sort((a, b) => {
      if (a[field] < b[field]) return sortOrder === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setWarehouses(sortedWarehouses);
  };

  // Filter warehouses by warehouse ID or address
  const filteredWarehouses = warehouses.filter((warehouse) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      warehouse.Ma_kho.toLowerCase().includes(searchLower) || warehouse.Dia_chi.toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastWarehouse = currentPage * warehousesPerPage;
  const indexOfFirstWarehouse = indexOfLastWarehouse - warehousesPerPage;
  const currentWarehouses = filteredWarehouses.slice(indexOfFirstWarehouse, indexOfLastWarehouse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredWarehouses.length / warehousesPerPage);

  return (
    <div className="container mt-5">
      <h1>Warehouses List</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search warehouses by Warehouse ID or Address"
          value={searchQuery}
          onChange={handleSearch}
          style={{ width: '36%' }}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {filteredWarehouses.length === 0 ? (
            <p>No warehouses found.</p>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>
                    Warehouse ID
                    <button
                      className="btn btn-link"
                      onClick={() => {
                        const newOrder = sortWarehouseID === 'asc' ? 'desc' : 'asc';
                        setSortWarehouseID(newOrder);
                        handleSort('Ma_kho', newOrder);
                      }}
                    >
                      <FaSort />
                    </button>
                  </th>
                  <th>
                    Address
                    <button
                      className="btn btn-link"
                      onClick={() => {
                        const newOrder = sortWarehouseAddress === 'asc' ? 'desc' : 'asc';
                        setSortWarehouseAddress(newOrder);
                        handleSort('Dia_chi', newOrder);
                      }}
                    >
                      <FaSort />
                    </button>
                  </th>
                  <th>
                    Storage Capacity
                    <button
                      className="btn btn-link"
                      onClick={() => {
                        const newOrder = sortWarehouseMax === 'asc' ? 'desc' : 'asc';
                        setSortWarehouseMax(newOrder);
                        handleSort('Suc_chua_toi_da', newOrder);
                      }}
                    >
                      <FaSort />
                    </button>
                  </th>
                  <th>
                    Number of Packages
                    <button
                      className="btn btn-link"
                      onClick={() => {
                        const newOrder = sortWarehouseNumber === 'asc' ? 'desc' : 'asc';
                        setSortWarehouseNumber(newOrder);
                        handleSort('So_luong_kien_hang', newOrder);
                      }}
                    >
                      <FaSort />
                    </button>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentWarehouses.map((warehouse) => (
                  <tr key={warehouse.Ma_kho}>
                    <td>{warehouse.Ma_kho}</td>
                    <td>{warehouse.Dia_chi}</td>
                    <td>{warehouse.Suc_chua_toi_da}</td>
                    <td>{warehouse.So_luong_kien_hang}</td>
                    <td>
                      <button className="btn btn-warning mr-2" onClick={() => updateWarehouse(warehouse.Ma_kho)}>
                        <FaEdit />
                      </button>
                      <button className="btn btn-danger" onClick={() => {
                        setWarehouseToDelete(warehouse.Ma_kho);
                        setShowConfirmModal(true);
                      }}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          <nav>
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => currentPage > 1 && paginate(currentPage - 1)} // Disable "Prev" if on first page
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
                onClick={() => currentPage < totalPages && paginate(currentPage + 1)} // Disable "Next" if on last page
                style={{ cursor: 'pointer' }}
              >
                <span className="page-link">Next</span>
              </li>
            </ul>
          </nav>
        </>
      )}

      {/* Confirmation Modal */}
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
              <p>Are you sure you want to delete this warehouse?</p>
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
                onClick={() => {
                  if (warehouseToDelete) {
                    deleteWarehouse(warehouseToDelete);
                  }
                }}
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

export default WarehousesList;
