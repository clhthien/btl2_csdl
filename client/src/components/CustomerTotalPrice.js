import React, { useState } from 'react';
import { FaSort } from 'react-icons/fa';

const CustomerTotalPrice = () => {
  const [giaTri, setGiaTri] = useState(''); // Lưu giá trị nhập vào từ form
  const [customers, setCustomers] = useState([]); // Lưu kết quả từ API
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Lưu thông báo lỗi nếu có
  const [searchQuery, setSearchQuery] = useState(''); // Dữ liệu tìm kiếm

  // Các trạng thái sắp xếp
  const [sortOrderMaKhachHang, setSortOrderMaKhachHang] = useState('asc');
  const [sortOrderHoTen, setSortOrderHoTen] = useState('asc');
  const [sortOrderTongGiaTri, setSortOrderTongGiaTri] = useState('asc');

  // Hàm xử lý khi người dùng gửi form
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngừng hành động mặc định của form

    // Kiểm tra nếu giaTri rỗng hoặc không phải là số hợp lệ
    if (!giaTri || isNaN(giaTri)) {
      setError('Giá trị không hợp lệ!');
      return;
    }

    // Gọi API khi người dùng gửi giá trị
    setLoading(true); // Bật trạng thái tải dữ liệu
    setError(null); // Xóa lỗi cũ nếu có

    fetch(`${process.env.REACT_APP_API_URL}/khachhang/tonggiatri/${giaTri}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCustomers(data); // Lưu dữ liệu trả về
        setLoading(false); // Tắt trạng thái tải dữ liệu
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
        setError('Có lỗi xảy ra khi lấy dữ liệu!'); // Hiển thị lỗi nếu có
        setLoading(false); // Tắt trạng thái tải dữ liệu
      });
  };

  // Hàm sắp xếp
  const handleSort = (field, sortOrder) => {
    const sortedCustomers = [...customers].sort((a, b) => {
      // Chuyển đổi giá trị của `TongGiaTri` thành kiểu số (number)
      const valueA = field === 'TongGiaTri' ? parseFloat(a[field]) : a[field];
      const valueB = field === 'TongGiaTri' ? parseFloat(b[field]) : b[field];
  
      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setCustomers(sortedCustomers);
  };

  // Hàm lọc dữ liệu theo từ khóa tìm kiếm
  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Cập nhật giá trị tìm kiếm
  };

  // Lọc các khách hàng theo từ khóa tìm kiếm
  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.MaKhachHang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.HoTen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.TongGiaTri.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="container mt-5">
      <h2>Danh Sách Khách Hàng Theo Tổng Giá Trị</h2>

      {/* Form nhập giá trị */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="giaTri">Nhập giá trị:</label>
          <input
            type="text"
            className="form-control"
            id="giaTri"
            value={giaTri}
            onChange={(e) => setGiaTri(e.target.value)} // Cập nhật giá trị khi người dùng nhập
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
          {loading ? 'Đang Tải...' : 'Tìm Kiếm'}
        </button>
      </form>

      {/* Hiển thị thông báo lỗi nếu có */}
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {/* Hiển thị thanh tìm kiếm khi có dữ liệu */}
      {customers.length > 0 && !loading && (
        <div className="mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm trong bảng"
            value={searchQuery}
            onChange={handleSearch} // Cập nhật giá trị tìm kiếm
          />
        </div>
      )}

      {customers.length > 0 && !loading && (
        <div className="mt-5">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>
                  Ma Khach Hang
                  <button
                    className="btn btn-link"
                    onClick={() => {
                      const newOrder = sortOrderMaKhachHang === 'asc' ? 'desc' : 'asc';
                      setSortOrderMaKhachHang(newOrder);
                      handleSort('MaKhachHang', newOrder);
                    }}
                  >
                    <FaSort />
                  </button>
                </th>
                <th>
                  Ho Ten
                  <button
                    className="btn btn-link"
                    onClick={() => {
                      const newOrder = sortOrderHoTen === 'asc' ? 'desc' : 'asc';
                      setSortOrderHoTen(newOrder);
                      handleSort('HoTen', newOrder);
                    }}
                  >
                    <FaSort />
                  </button>
                </th>
                <th>
                  Tong Gia Tri
                  <button
                    className="btn btn-link"
                    onClick={() => {
                      const newOrder = sortOrderTongGiaTri === 'asc' ? 'desc' : 'asc';
                      setSortOrderTongGiaTri(newOrder);
                      handleSort('TongGiaTri', newOrder);
                    }}
                  >
                    <FaSort />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.MaKhachHang}>
                  <td>{customer.MaKhachHang}</td>
                  <td>{customer.HoTen}</td>
                  <td>{customer.TongGiaTri}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Nếu không có kết quả */}
      {customers.length === 0 && !loading && !error && (
        <div className="alert alert-info mt-3">Không có khách hàng nào với tổng giá trị đủ điều kiện!</div>
      )}
    </div>
  );
};

export default CustomerTotalPrice;

// import React, { useState} from 'react';
// import { FaSort } from 'react-icons/fa';

// const CustomerTotalPrice = () => {
//   const [giaTri, setGiaTri] = useState(''); // Lưu giá trị nhập vào từ form
//   const [customers, setCustomers] = useState([]); // Lưu kết quả từ API
//   const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
//   const [error, setError] = useState(null); // Lưu thông báo lỗi nếu có

//   // Các trạng thái sắp xếp
//   const [sortOrderMaKhachHang, setSortOrderMaKhachHang] = useState('asc');
//   const [sortOrderHoTen, setSortOrderHoTen] = useState('asc');
//   const [sortOrderTongGiaTri, setSortOrderTongGiaTri] = useState('asc');

//   // Hàm xử lý khi người dùng gửi form
//   const handleSubmit = (e) => {
//     e.preventDefault(); // Ngừng hành động mặc định của form

//     // Kiểm tra nếu giaTri rỗng hoặc không phải là số hợp lệ
//     if (!giaTri || isNaN(giaTri)) {
//       setError('Giá trị không hợp lệ!');
//       return;
//     }

//     // Gọi API khi người dùng gửi giá trị
//     setLoading(true); // Bật trạng thái tải dữ liệu
//     setError(null); // Xóa lỗi cũ nếu có

//     fetch(`${process.env.REACT_APP_API_URL}/khachhang/tonggiatri/${giaTri}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setCustomers(data); // Lưu dữ liệu trả về
//         setLoading(false); // Tắt trạng thái tải dữ liệu
//       })
//       .catch((error) => {
//         console.error('Error fetching customers:', error);
//         setError('Có lỗi xảy ra khi lấy dữ liệu!'); // Hiển thị lỗi nếu có
//         setLoading(false); // Tắt trạng thái tải dữ liệu
//       });
//   };

//   // Hàm sắp xếp
//   const handleSort = (field, sortOrder) => {
//     const sortedCustomers = [...customers].sort((a, b) => {
//       // Chuyển đổi giá trị của `TongGiaTri` thành kiểu số (number)
//       const valueA = field === 'TongGiaTri' ? parseFloat(a[field]) : a[field];
//       const valueB = field === 'TongGiaTri' ? parseFloat(b[field]) : b[field];
  
//       if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
//       if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
//       return 0;
//     });
//     setCustomers(sortedCustomers);
//   };

//   return (
//     <div className="container mt-5">
//       <h2>Danh Sách Khách Hàng Theo Tổng Giá Trị</h2>

//       {/* Form nhập giá trị */}
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="giaTri">Nhập giá trị:</label>
//           <input
//             type="text"
//             className="form-control"
//             id="giaTri"
//             value={giaTri}
//             onChange={(e) => setGiaTri(e.target.value)} // Cập nhật giá trị khi người dùng nhập
//           />
//         </div>
//         <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
//           {loading ? 'Đang Tải...' : 'Tìm Kiếm'}
//         </button>
//       </form>

//       {/* Hiển thị thông báo lỗi nếu có */}
//       {error && <div className="alert alert-danger mt-3">{error}</div>}

//       {/* Hiển thị danh sách khách hàng nếu có */}
//       {customers.length > 0 && !loading && (
//         <div className="mt-5">
//           <h3>Danh sách khách hàng</h3>
//           <table className="table table-bordered">
//             <thead>
//               <tr>
//                 <th>
//                   Ma Khach Hang
//                   <button
//                     className="btn btn-link"
//                     onClick={() => {
//                       const newOrder = sortOrderMaKhachHang === 'asc' ? 'desc' : 'asc';
//                       setSortOrderMaKhachHang(newOrder);
//                       handleSort('MaKhachHang', newOrder);
//                     }}
//                   >
//                     <FaSort />
//                   </button>
//                 </th>
//                 <th>
//                   Ho Ten
//                   <button
//                     className="btn btn-link"
//                     onClick={() => {
//                       const newOrder = sortOrderHoTen === 'asc' ? 'desc' : 'asc';
//                       setSortOrderHoTen(newOrder);
//                       handleSort('HoTen', newOrder);
//                     }}
//                   >
//                     <FaSort />
//                   </button>
//                 </th>
//                 <th>
//                   Tong Gia Tri
//                   <button
//                     className="btn btn-link"
//                     onClick={() => {
//                       const newOrder = sortOrderTongGiaTri === 'asc' ? 'desc' : 'asc';
//                       setSortOrderTongGiaTri(newOrder);
//                       handleSort('TongGiaTri', newOrder);
//                     }}
//                   >
//                     <FaSort />
//                   </button>
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {customers.map((customer) => (
//                 <tr key={customer.MaKhachHang}>
//                   <td>{customer.MaKhachHang}</td>
//                   <td>{customer.HoTen}</td>
//                   <td>{customer.TongGiaTri}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Nếu không có kết quả */}
//       {customers.length === 0 && !loading && !error && (
//         <div className="alert alert-info mt-3">Không có khách hàng nào với tổng giá trị đủ điều kiện!</div>
//       )}
//     </div>
//   );
// };

// export default CustomerTotalPrice;
