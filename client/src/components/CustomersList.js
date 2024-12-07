import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './CustomersList.css'; // Import file CSS tùy chỉnh

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrderMaKhachHang, setSortOrderMaKhachHang] = useState('asc'); // Sort order for customer ID
  const [sortOrderFirstName, setSortOrderFirstName] = useState('asc'); // Sort order for first name
  const [sortOrderLastName, setSortOrderLastName] = useState('asc'); // Sort order for last name
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(5); // Number of customers per page
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

  const deleteCustomer = (customerId) => {
    fetch(process.env.REACT_APP_API_URL + '/khachhang/' + customerId, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message); // Show success message when deleted
        }
        setCustomers(customers.filter(customer => customer.Ma_khach_hang !== customerId)); // Update customer list
      })
      .catch((error) => console.error('Error deleting customer:', error));
  };

  const updateCustomer = (customerId) => {
    navigate(`/customers/update/${customerId}`); // Navigate to UpdateCustomer page
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handleSort = (field, sortOrder) => {
    const sortedCustomers = [...customers].sort((a, b) => {
      if (a[field] < b[field]) return sortOrder === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setCustomers(sortedCustomers);
  };

  // Filter customers by full name or customer ID
  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.Ho_ten_dem} ${customer.Ten}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    return (
      fullName.includes(searchLower) || customer.Ma_khach_hang.toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  return (
    <div className="container mt-4">
      <h1>Customer List</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search customers by full name or customer ID"
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
                Customer ID
                <button
                  className="btn btn-link"
                  onClick={() => {
                    const newOrder = sortOrderMaKhachHang === 'asc' ? 'desc' : 'asc';
                    setSortOrderMaKhachHang(newOrder);
                    handleSort('Ma_khach_hang', newOrder);
                  }}
                >
                  {sortOrderMaKhachHang === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
                </button>
              </th>
              <th>
                First Name
                <button
                  className="btn btn-link"
                  onClick={() => {
                    const newOrder = sortOrderFirstName === 'asc' ? 'desc' : 'asc';
                    setSortOrderFirstName(newOrder);
                    handleSort('Ho_ten_dem', newOrder);
                  }}
                >
                  {sortOrderFirstName === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
                </button>
              </th>
              <th>
                Last Name
                <button
                  className="btn btn-link"
                  onClick={() => {
                    const newOrder = sortOrderLastName === 'asc' ? 'desc' : 'asc';
                    setSortOrderLastName(newOrder);
                    handleSort('Ten', newOrder);
                  }}
                >
                  {sortOrderLastName === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
                </button>
              </th>
              <th>Phone Number</th> {/* No sorting on this column */}
              <th>Email</th> {/* No sorting on this column */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length === 0 ? (
              <tr>
                <td colSpan="6">No customers found.</td>
              </tr>
            ) : (
              currentCustomers.map((customer) => (
                <tr key={customer.Ma_khach_hang}>
                  <td>{customer.Ma_khach_hang}</td>
                  <td>{customer.Ho_ten_dem}</td>
                  <td>{customer.Ten}</td>
                  <td>{customer.SDT}</td>
                  <td>{customer.Email}</td>
                  <td>
                    <button className="btn btn-warning mr-2" onClick={() => updateCustomer(customer.Ma_khach_hang)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-danger" onClick={() => deleteCustomer(customer.Ma_khach_hang)}>
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

export default CustomersList;
