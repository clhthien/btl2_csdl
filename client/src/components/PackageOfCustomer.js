import React, { useState } from 'react';
import { FaSort } from 'react-icons/fa';

const PackageOfCustomer = () => {
  const [maKhachHang, setMaKhachHang] = useState(''); // Mã khách hàng
  const [packages, setPackages] = useState([]); // Dữ liệu kiện hàng
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Lỗi khi lấy dữ liệu
  const [searchQuery, setSearchQuery] = useState(''); // Dữ liệu tìm kiếm

  // Các trạng thái sắp xếp
  const [sortOrderMaKih, setSortOrderMaKih] = useState('asc');
  const [sortOrderKichThuoc, setSortOrderKichThuoc] = useState('asc');
  const [sortOrderCanNang, setSortOrderCanNang] = useState('asc');
  const [sortOrderGtKienHang, setSortOrderGtKienHang] = useState('asc');

  // Hàm xử lý khi người dùng gửi form
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngừng hành động mặc định của form

    // Kiểm tra nếu maKhachHang rỗng
    if (!maKhachHang) {
      setError('Mã khách hàng không thể trống');
      return;
    }

    // Gọi API để lấy dữ liệu kiện hàng của khách hàng
    setLoading(true);
    setError(null); // Reset lỗi trước khi bắt đầu gọi API
    fetch(`http://localhost:3001/api/kienhang/khachhang/${maKhachHang}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu');
        }
        return response.json();
      })
      .then((data) => {
        setPackages(data); // Lưu dữ liệu vào state
        setLoading(false); // Đã tải xong
      })
      .catch((error) => {
        setError(error.message); // Lưu lỗi vào state
        setLoading(false); // Đã tải xong, dù có lỗi
      });
  };

  // Hàm sắp xếp
  const handleSort = (field, sortOrder) => {
    const sortedPackages = [...packages].sort((a, b) => {
      const valueA = field === 'Gt_kien_hang' ? parseFloat(a[field]) : a[field]; // Đảm bảo giá trị Gt_kien_hang là kiểu số
      const valueB = field === 'Gt_kien_hang' ? parseFloat(b[field]) : b[field];

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setPackages(sortedPackages);
  };

  // Hàm lọc dữ liệu dựa trên tìm kiếm
  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Cập nhật giá trị tìm kiếm
  };

  // Lọc các kiện hàng theo từ khóa tìm kiếm
  const filteredPackages = packages.filter((pkg) => {
    return (
      pkg.Ma_kih.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.Ho_ten_dem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.Ten.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.Kich_thuoc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.Can_nang.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.Gt_kien_hang.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="container mt-5">
      <h1>Danh sách kiện hàng của khách hàng</h1>

      {/* Form nhập Mã khách hàng */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="maKhachHang" className="form-label">
            Mã khách hàng
          </label>
          <input
            type="text"
            id="maKhachHang"
            className="form-control"
            value={maKhachHang}
            onChange={(e) => setMaKhachHang(e.target.value)} // Cập nhật mã khách hàng khi người dùng nhập
            placeholder="Nhập mã khách hàng"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Tìm kiếm
        </button>
      </form>

      {/* Hiển thị thông báo lỗi nếu có */}
      {error && <p className="text-danger mt-3">{error}</p>}

      {/* Hiển thị thông tin kiện hàng */}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          {packages.length === 0 ? (
            <p>Không có kiện hàng nào cho khách hàng này.</p>
          ) : (
            <>
              {/* Thanh tìm kiếm */}
              <div className="mb-3 mt-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm trong bảng"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>

              {/* Hiển thị bảng khi có dữ liệu */}
              <table className="table table-bordered mt-4">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>
                      Package ID
                      <button
                        className="btn btn-link"
                        onClick={() => {
                          const newOrder = sortOrderMaKih === 'asc' ? 'desc' : 'asc';
                          setSortOrderMaKih(newOrder);
                          handleSort('Ma_kih', newOrder);
                        }}
                      >
                        <FaSort />
                      </button>
                    </th>
                    <th>
                      Size
                      <button
                        className="btn btn-link"
                        onClick={() => {
                          const newOrder = sortOrderKichThuoc === 'asc' ? 'desc' : 'asc';
                          setSortOrderKichThuoc(newOrder);
                          handleSort('Kich_thuoc', newOrder);
                        }}
                      >
                        <FaSort />
                      </button>
                    </th>
                    <th>
                      Weight (kg)
                      <button
                        className="btn btn-link"
                        onClick={() => {
                          const newOrder = sortOrderCanNang === 'asc' ? 'desc' : 'asc';
                          setSortOrderCanNang(newOrder);
                          handleSort('Can_nang', newOrder);
                        }}
                      >
                        <FaSort />
                      </button>
                    </th>
                    <th>
                      Package Value
                      <button
                        className="btn btn-link"
                        onClick={() => {
                          const newOrder = sortOrderGtKienHang === 'asc' ? 'desc' : 'asc';
                          setSortOrderGtKienHang(newOrder);
                          handleSort('Gt_kien_hang', newOrder);
                        }}
                      >
                        <FaSort />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((pkg) => (
                    <tr key={pkg.Ma_kih}>
                      <td>{pkg.Ho_ten_dem} {pkg.Ten}</td>
                      <td>{pkg.Ma_kih}</td>
                      <td>{pkg.Kich_thuoc}</td>
                      <td>{pkg.Can_nang}</td>
                      <td>{pkg.Gt_kien_hang}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PackageOfCustomer;

// import React, { useState } from 'react';
// import { FaSort } from 'react-icons/fa';

// const PackageOfCustomer = () => {
//   const [maKhachHang, setMaKhachHang] = useState(''); // Mã khách hàng
//   const [packages, setPackages] = useState([]); // Dữ liệu kiện hàng
//   const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
//   const [error, setError] = useState(null); // Lỗi khi lấy dữ liệu

//   // Các trạng thái sắp xếp
//   const [sortOrderMaKih, setSortOrderMaKih] = useState('asc');
//   const [sortOrderKichThuoc, setSortOrderKichThuoc] = useState('asc');
//   const [sortOrderCanNang, setSortOrderCanNang] = useState('asc');
//   const [sortOrderGtKienHang, setSortOrderGtKienHang] = useState('asc');

//   // Hàm xử lý khi người dùng gửi form
//   const handleSubmit = (e) => {
//     e.preventDefault(); // Ngừng hành động mặc định của form

//     // Kiểm tra nếu maKhachHang rỗng
//     if (!maKhachHang) {
//       setError('Mã khách hàng không thể trống');
//       return;
//     }

//     // Gọi API để lấy dữ liệu kiện hàng của khách hàng
//     setLoading(true);
//     setError(null); // Reset lỗi trước khi bắt đầu gọi API
//     fetch(`http://localhost:3001/api/kienhang/khachhang/${maKhachHang}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Không thể lấy dữ liệu');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setPackages(data); // Lưu dữ liệu vào state
//         setLoading(false); // Đã tải xong
//       })
//       .catch((error) => {
//         setError(error.message); // Lưu lỗi vào state
//         setLoading(false); // Đã tải xong, dù có lỗi
//       });
//   };

//   // Hàm sắp xếp
//   const handleSort = (field, sortOrder) => {
//     const sortedPackages = [...packages].sort((a, b) => {
//       const valueA = field === 'Gt_kien_hang' ? parseFloat(a[field]) : a[field]; // Đảm bảo giá trị Gt_kien_hang là kiểu số
//       const valueB = field === 'Gt_kien_hang' ? parseFloat(b[field]) : b[field];

//       if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
//       if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
//       return 0;
//     });
//     setPackages(sortedPackages);
//   };

//   return (
//     <div className="container mt-5">
//       <h1>Danh sách kiện hàng của khách hàng</h1>

//       {/* Form nhập Mã khách hàng */}
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label htmlFor="maKhachHang" className="form-label">
//             Mã khách hàng
//           </label>
//           <input
//             type="text"
//             id="maKhachHang"
//             className="form-control"
//             value={maKhachHang}
//             onChange={(e) => setMaKhachHang(e.target.value)} // Cập nhật mã khách hàng khi người dùng nhập
//             placeholder="Nhập mã khách hàng"
//           />
//         </div>
//         <button type="submit" className="btn btn-primary">
//           Tìm kiếm
//         </button>
//       </form>

//       {/* Hiển thị thông báo lỗi nếu có */}
//       {error && <p className="text-danger mt-3">{error}</p>}

//       {/* Hiển thị thông tin kiện hàng */}
//       {loading ? (
//         <p>Đang tải...</p>
//       ) : (
//         <>
//           {packages.length === 0 ? (
//             <p>Không có kiện hàng nào cho khách hàng này.</p>
//           ) : (
//             <table className="table table-bordered mt-4">
//               <thead>
//                 <tr>
//                   <th>Full Name</th>
//                   <th>
//                     Package ID
//                     <button
//                       className="btn btn-link"
//                       onClick={() => {
//                         const newOrder = sortOrderMaKih === 'asc' ? 'desc' : 'asc';
//                         setSortOrderMaKih(newOrder);
//                         handleSort('Ma_kih', newOrder);
//                       }}
//                     >
//                       <FaSort />
//                     </button>
//                   </th>
//                   <th>
//                     Size
//                     <button
//                       className="btn btn-link"
//                       onClick={() => {
//                         const newOrder = sortOrderKichThuoc === 'asc' ? 'desc' : 'asc';
//                         setSortOrderKichThuoc(newOrder);
//                         handleSort('Kich_thuoc', newOrder);
//                       }}
//                     >
//                       <FaSort />
//                     </button>
//                   </th>
//                   <th>
//                     Weight (kg)
//                     <button
//                       className="btn btn-link"
//                       onClick={() => {
//                         const newOrder = sortOrderCanNang === 'asc' ? 'desc' : 'asc';
//                         setSortOrderCanNang(newOrder);
//                         handleSort('Can_nang', newOrder);
//                       }}
//                     >
//                       <FaSort />
//                     </button>
//                   </th>
//                   <th>
//                     Package Value
//                     <button
//                       className="btn btn-link"
//                       onClick={() => {
//                         const newOrder = sortOrderGtKienHang === 'asc' ? 'desc' : 'asc';
//                         setSortOrderGtKienHang(newOrder);
//                         handleSort('Gt_kien_hang', newOrder);
//                       }}
//                     >
//                       <FaSort />
//                     </button>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {packages.map((pkg) => (
//                   <tr key={pkg.Ma_kih}>
//                     <td>{pkg.Ho_ten_dem} {pkg.Ten}</td>
//                     <td>{pkg.Ma_kih}</td>
//                     <td>{pkg.Kich_thuoc}</td>
//                     <td>{pkg.Can_nang}</td>
//                     <td>{pkg.Gt_kien_hang}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PackageOfCustomer;
