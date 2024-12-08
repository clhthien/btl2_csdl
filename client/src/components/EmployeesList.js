// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaEdit, FaTrash } from 'react-icons/fa';

// const EmployeesList = () => {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch(process.env.REACT_APP_API_URL + '/nhanvien')
//       .then((response) => response.json())
//       .then((data) => {
//         setEmployees(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching employees:', error);
//         setLoading(false);
//       });
//   }, []);

//   const deleteEmployee = (ma_nv) => {
//     fetch(process.env.REACT_APP_API_URL + '/nhanvien/' + ma_nv, {
//       method: 'DELETE',
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.message) {
//           alert(data.message); // Hiển thị thông báo khi xóa thành công
//         }
//         setEmployees(employees.filter(employee => employee.Ma_nv !== ma_nv)); // Cập nhật lại danh sách nhân viên
//       })
//       .catch((error) => console.error('Error deleting employee:', error));
//   };

//   const updateEmployee = (ma_nv) => {
//     navigate(`/employees/update/${ma_nv}`); // Điều hướng tới trang UpdateEmployee với id của nhân viên
//   };

//   return (
//     <div className="container mt-5">
//       <h1>Danh sách Nhân Viên</h1>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <table className="table table-bordered">
//           <thead>
//             <tr>
//               <th>Ma_nv</th>
//               <th>Họ và tên đệm</th>
//               <th>Tên</th>
//               <th>Ngày sinh</th>
//               <th>Số điện thoại</th>
//               <th>Thao tác</th>
//             </tr>
//           </thead>
//           <tbody>
//             {employees.length === 0 ? (
//               <tr>
//                 <td colSpan="6">Không có nhân viên nào.</td>
//               </tr>
//             ) : (
//               employees.map((employee) => (
//                 <tr key={employee.Ma_nv}>
//                   <td>{employee.Ma_nv}</td>
//                   <td>{employee.Ho_ten_dem}</td>
//                   <td>{employee.Ten}</td>
//                   <td>{employee.Ngay_sinh}</td>
//                   <td>{employee.SDT}</td>
//                   <td>
//                     <button className="btn btn-warning mr-2" onClick={() => updateEmployee(employee.Ma_nv)}><FaEdit /></button>
//                     <button className="btn btn-danger" onClick={() => deleteEmployee(employee.Ma_nv)}><FaTrash /></button>
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

// export default EmployeesList;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/nhanvien')
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
        setLoading(false);
      });
  }, []);

  const deleteEmployee = (ma_nv) => {
    fetch(process.env.REACT_APP_API_URL + '/nhanvien/' + ma_nv, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message); // Hiển thị thông báo khi xóa thành công
        }
        setEmployees(employees.filter(employee => employee.Ma_nv !== ma_nv)); // Cập nhật lại danh sách nhân viên
      })
      .catch((error) => console.error('Error deleting employee:', error));
  };

  const updateEmployee = (ma_nv) => {
    navigate(`/employees/update/${ma_nv}`); // Điều hướng tới trang UpdateEmployee với id của nhân viên
  };

  return (
    <div className="container mt-5">
      <h1>Danh sách Nhân Viên</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Ma_nv</th>
              <th>Họ và tên đệm</th>
              <th>Tên</th>
              <th>Ngày sinh</th>
              <th>Số điện thoại</th>
              {/* <th>Loại nhân viên</th> */}
              <th>Thông tin thêm</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="8">Không có nhân viên nào.</td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.Ma_nv}>
                  <td>{employee.Ma_nv}</td>
                  <td>{employee.Ho_ten_dem}</td>
                  <td>{employee.Ten}</td>
                  <td>{employee.Ngay_sinh}</td>
                  <td>{employee.SDT}</td>
                  {/* <td>{employee.Loai_nhan_vien}</td> */}
                  <td>
                    {/* Hiển thị thông tin thêm dựa trên loại nhân viên */}
                    {employee.Loai_nhan_vien === 'bao_tri' && employee.Bao_tri && (
                      <span>Địa chỉ: {employee.Bao_tri}</span>
                    )}
                    {employee.Loai_nhan_vien === 'giao_hang' && (
                      <>
                        <div>Bằng lái: {employee.Giao_hang?.bang_lai}</div>
                        <div>Phương tiện: {employee.Giao_hang?.phuong_tien}</div>
                      </>
                    )}
                    {employee.Loai_nhan_vien === 'van_phong' && (
                      <>
                        <div>Địa chỉ: {employee.Van_phong?.dia_chi}</div>
                        <div>Email: {employee.Van_phong?.email}</div>
                      </>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-warning mr-2" onClick={() => updateEmployee(employee.Ma_nv)}><FaEdit /></button>
                    <button className="btn btn-danger" onClick={() => deleteEmployee(employee.Ma_nv)}><FaTrash /></button>
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

export default EmployeesList;
