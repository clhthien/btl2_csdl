import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const PackagesList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [packagesPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/kienhang')
      .then((response) => response.json())
      .then((data) => {
        setPackages(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching packages:', error);
        setLoading(false);
      });
  }, []);

  const deletePackage = (id) => {
    fetch(process.env.REACT_APP_API_URL + '/kienhang/' + id, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
        }
        setPackages(packages.filter(pkg => pkg.Ma_kih !== id));
      })
      .catch((error) => console.error('Error deleting package:', error));
  };

  const updatePackage = (id) => {
    navigate(`/packages/update/${id}`);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    const sortedPackages = [...packages].sort((a, b) => {
      if (a[field] < b[field]) return newSortOrder === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return newSortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setPackages(sortedPackages);
  };

  const filteredPackages = packages.filter((pkg) => {
    const maKih = pkg.Ma_kih ? pkg.Ma_kih.toLowerCase() : '';
    const loaiHang = pkg.Loai_hang ? pkg.Loai_hang.toLowerCase() : '';
    return (
      maKih.includes(searchQuery.toLowerCase()) ||
      loaiHang.includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = filteredPackages.slice(indexOfFirstPackage, indexOfLastPackage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage);

  return (
    <div className="container mt-5">
      <h1>Danh sách Gói Hàng</h1>
      
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm gói hàng"
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
                <button className="btn btn-link" onClick={() => handleSort('Ma_kih')}>
                  Mã gói {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </th>
              <th>
                  Loại hàng
              </th>
              <th>
                  Kích thước
              </th>
              <th>Giá kiện hàng</th>
              <th>Khối lượng</th>
              <th>Mã kho</th>
              <th>Mã đơn đặt hàng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentPackages.length === 0 ? (
              <tr>
                <td colSpan="8">Không có gói hàng nào.</td>
              </tr>
            ) : (
              currentPackages.map((pkg) => (
                <tr key={pkg.Ma_kih}>
                  <td>{pkg.Ma_kih}</td>
                  <td>{pkg.Loai_hang}</td>
                  <td>{pkg.Kich_thuoc}</td>
                  <td>{pkg.Gt_kien_hang}</td>
                  <td>{pkg.Can_nang}</td>
                  <td>{pkg.Ma_kho}</td>
                  <td>{pkg.Ma_ddh}</td>
                  <td>
                    <button className="btn btn-warning mr-2" onClick={() => updatePackage(pkg.Ma_kih)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-danger" onClick={() => deletePackage(pkg.Ma_kih)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <nav>
        <ul className="pagination">
          <li className="page-item" onClick={() => paginate(currentPage - 1)} style={{ cursor: 'pointer' }} disabled={currentPage === 1}>
            <span className="page-link">Prev</span>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`} onClick={() => paginate(index + 1)} style={{ cursor: 'pointer' }}>
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

export default PackagesList;
