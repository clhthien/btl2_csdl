// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {FaEdit, FaTrash} from 'react-icons/fa';

// const CustomersList = () => {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch(process.env.REACT_APP_API_URL + '/khachhang')
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setCustomers(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching customers:', error);
//         setLoading(false);
//       });
//   }, []);

//   const deleteCustomer = (ma_khach_hang) => {
//     fetch(process.env.REACT_APP_API_URL + '/khachhang/' + ma_khach_hang, {
//       method: 'DELETE',
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.message) {
//           alert(data.message); // Hiển thị thông báo khi xóa thành công
//         }
//         setCustomers(customers.filter(customer => customer.Ma_khach_hang !== ma_khach_hang)); // Cập nhật lại danh sách khách hàng
//       })
//       .catch((error) => console.error('Error deleting customer:', error));
//   };

//   const updateCustomer = (ma_khach_hang) => {
//     navigate(`/customers/update/${ma_khach_hang}`); // Điều hướng tới trang UpdateCustomer với id của khách hàng
//   };

//   return (
//     <div className="container mt-5">
//       <h1>Danh sách Khách Hàng</h1>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <table className="table table-bordered">
//           <thead>
//             <tr>
//               <th>Ma_khach_hang</th>
//               <th>Họ và tên đệm</th>
//               <th>Tên</th>
//               <th>Số điện thoại</th>
//               <th>Email</th>
//               <th>Thao tác</th>
//             </tr>
//           </thead>
//           <tbody>
//             {customers.length === 0 ? (
//               <tr>
//                 <td colSpan="6">Không có khách hàng nào.</td>
//               </tr>
//             ) : (
//               customers.map((customer) => (
//                 <tr key={customer.Ma_khach_hang}>
//                   <td>{customer.Ma_khach_hang}</td>
//                   <td>{customer.Ho_ten_dem}</td>
//                   <td>{customer.Ten}</td>
//                   <td>{customer.SDT}</td>
//                   <td>{customer.Email}</td>
//                   <td>
//                     <button className="btn btn-warning mr-2" style={{marginRight:'10px'}} onClick={() => updateCustomer(customer.Ma_khach_hang)}><FaEdit/></button>
//                     <button className="btn btn-danger" onClick={() => deleteCustomer(customer.Ma_khach_hang)}><FaTrash/></button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default CustomersList;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(5); // Số khách hàng mỗi trang
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

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Khi tìm kiếm, quay về trang đầu
  };

  const handleSort = (field) => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    const sortedCustomers = [...customers].sort((a, b) => {
      if (a[field] < b[field]) return newSortOrder === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return newSortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setCustomers(sortedCustomers);
  };

  // Lọc khách hàng theo mã khách hàng hoặc họ tên
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

  // Tính toán tổng số trang
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  return (
    <div className="container mt-5">
      <h1>Danh sách Khách Hàng</h1>
      
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm khách hàng theo họ tên hoặc mã khách hàng"
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
                <button className="btn btn-link" onClick={() => handleSort('Ma_khach_hang')}>
                  Mã khách hàng {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </th>
              <th>
                <button className="btn btn-link" onClick={() => handleSort('Ho_ten_dem')}>
                  Họ và tên đệm {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </th>
              <th>
                <button className="btn btn-link" onClick={() => handleSort('Ten')}>
                  Tên {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length === 0 ? (
              <tr>
                <td colSpan="6">Không có khách hàng nào.</td>
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
                    <button className="btn btn-warning mr-2" style={{ marginRight: '10px' }} onClick={() => updateCustomer(customer.Ma_khach_hang)}>
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

export default CustomersList;
