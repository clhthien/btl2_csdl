import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSort } from 'react-icons/fa';
//import './PackagesList.css';

const PackagesList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortPackageID, setSortPackageID] = useState('asc');
  const [sortPackagePrice, setSortPackagePrice] = useState('asc');
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

  // Delete package
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

  // Update package
  const updatePackage = (id) => {
    navigate(`/packages/update/${id}`);
  };

  // Handle search query change
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to page 1 when search query changes
  };

  // Handle sorting by field
  const handleSort = (field, sortOrder) => {
    const sortedPackages = [...packages].sort((a, b) => {
      if (a[field] < b[field]) return sortOrder === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setPackages(sortedPackages);
  };

  // Filter packages based on search query
  const filteredPackages = packages.filter((pkg) => {
    const maKih = pkg.Ma_kih ? pkg.Ma_kih.toLowerCase() : '';
    const loaiHang = pkg.Loai_hang ? pkg.Loai_hang.toLowerCase() : '';
    const maDDH = pkg.Ma_ddh ? pkg.Ma_ddh.toLowerCase() : '';
    const kichThuoc = pkg.Kich_thuoc ? pkg.Kich_thuoc.toLowerCase() : '';
    const gtKienHang = pkg.Gt_kien_hang ? pkg.Gt_kien_hang.toLowerCase() : '';
    const canNang = pkg.Can_nang ? pkg.Can_nang.toLowerCase() : '';
    const maKho = pkg.Ma_kho ? pkg.Ma_kho.toLowerCase() : '';
    return (
      maKih.includes(searchQuery.toLowerCase()) ||
      loaiHang.includes(searchQuery.toLowerCase()) ||
      maDDH.includes(searchQuery.toLowerCase()) ||
      kichThuoc.includes(searchQuery.toLowerCase()) ||
      gtKienHang.includes(searchQuery.toLowerCase()) ||
      canNang.includes(searchQuery.toLowerCase()) ||
      maKho.includes(searchQuery.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = filteredPackages.slice(indexOfFirstPackage, indexOfLastPackage);

  // Pagination click
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage);

  return (
    <div className="container mt-5">
      <h1>Package List</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search packages"
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
                Package ID
                <button className="btn btn-link"
                  onClick={() => {
                    const newPackage = sortPackageID === 'asc' ? 'desc' : 'asc';
                    setSortPackageID(newPackage);
                    handleSort('Ma_kih', newPackage);
                  }}
                >
                  <FaSort />
                </button>
              </th>
              <th>Type</th>
              <th>Size</th>
              <th>
                Price
                <button className="btn btn-link"
                  onClick={() => {
                    const newPackage = sortPackagePrice === 'asc' ? 'desc' : 'asc';
                    setSortPackagePrice(newPackage);
                    handleSort('Gt_kien_hang', newPackage);
                  }}
                >
                  <FaSort />
                </button>
              </th>
              <th>Weight</th>
              <th>Warehouse ID</th>
              <th>Order ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPackages.length === 0 ? (
              <tr>
                <td colSpan="8">No packages found.</td>
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
    </div>
  );
};

export default PackagesList;
