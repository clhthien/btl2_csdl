import React, { useState } from 'react';

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    Ma_nv: '',
    Ho_ten_dem: '',
    Ten: '',
    Ngay_sinh: '',
    SDT: '',
    Loai_nhan_vien: '',  // Để giá trị mặc định là rỗng
    Bao_tri: {
      dia_chi: '',
    },              // Đặc biệt cho loại nhân viên bảo trì
    Giao_hang: {
      bang_lai: '',          // Đặc biệt cho loại nhân viên giao hàng
      phuong_tien: '',
    },
    Van_phong: {
      dia_chi: '',           // Đặc biệt cho loại nhân viên văn phòng
      email: '',
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Cập nhật thông tin cho các thuộc tính riêng của mỗi loại nhân viên
    if (name === 'Loai_nhan_vien') {
      setEmployee({
        ...employee,
        Loai_nhan_vien: value,
        Bao_tri: { dia_chi: '' },
        Giao_hang: { bang_lai: '', phuong_tien: '' },
        Van_phong: { dia_chi: '', email: '' },
      });
    } else if (name.startsWith('Giao_hang') || name.startsWith('Van_phong')) {
      const [category, field] = name.split('.');
      setEmployee({
        ...employee,
        [category]: {
          ...employee[category],
          [field]: value,
        }
      });
    } else {
      setEmployee({
        ...employee,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employee.Ma_nv || !employee.Ho_ten_dem || !employee.Ten || !employee.SDT || !employee.Ngay_sinh) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/nhanvien', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Thêm nhân viên thành công!');
        setEmployee({
          Ma_nv: '',
          Ho_ten_dem: '',
          Ten: '',
          Ngay_sinh: '',
          SDT: '',
          Loai_nhan_vien: '', // Đặt lại mặc định
          Bao_tri: { dia_chi: '' },
          Giao_hang: { bang_lai: '', phuong_tien: '' },
          Van_phong: { dia_chi: '', email: '' }
        });
      } else {
        alert(data.message || 'Có lỗi xảy ra khi thêm nhân viên.');
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      alert('Không thể kết nối tới máy chủ.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Thêm Nhân Viên</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ma_nv:</label>
          <input
            type="text"
            className="form-control"
            name="Ma_nv"
            value={employee.Ma_nv}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Họ và tên đệm:</label>
          <input
            type="text"
            className="form-control"
            name="Ho_ten_dem"
            value={employee.Ho_ten_dem}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Tên:</label>
          <input
            type="text"
            className="form-control"
            name="Ten"
            value={employee.Ten}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Ngày sinh:</label>
          <input
            type="date"
            className="form-control"
            name="Ngay_sinh"
            value={employee.Ngay_sinh}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại:</label>
          <input
            type="text"
            className="form-control"
            name="SDT"
            value={employee.SDT}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Loại nhân viên:</label>
          <select
            className="form-control"
            name="Loai_nhan_vien"
            value={employee.Loai_nhan_vien}
            onChange={handleChange}
            required
          >
            <option value="">Chọn loại nhân viên</option> {/* Mặc định không chọn gì */}
            <option value="bao_tri">Nhân viên bảo trì</option>
            <option value="giao_hang">Nhân viên giao hàng</option>
            <option value="van_phong">Nhân viên văn phòng</option>
          </select>
        </div>

        {/* Các trường thông tin riêng cho từng loại nhân viên */}
        {employee.Loai_nhan_vien === 'bao_tri' && (
          <div className="form-group">
            <label>Địa chỉ làm việc:</label>
            <input
              type="text"
              className="form-control"
              name="Bao_tri.dia_chi"
              value={employee.Bao_tri.dia_chi}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {employee.Loai_nhan_vien === 'giao_hang' && (
          <>
            <div className="form-group">
              <label>Bằng lái:</label>
              <input
                type="text"
                className="form-control"
                name="Giao_hang.bang_lai"
                value={employee.Giao_hang.bang_lai}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phương tiện:</label>
              <input
                type="text"
                className="form-control"
                name="Giao_hang.phuong_tien"
                value={employee.Giao_hang.phuong_tien}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        {employee.Loai_nhan_vien === 'van_phong' && (
          <>
            <div className="form-group">
              <label>Địa chỉ làm việc:</label>
              <input
                type="text"
                className="form-control"
                name="Van_phong.dia_chi"
                value={employee.Van_phong.dia_chi}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                className="form-control"
                name="Van_phong.email"
                value={employee.Van_phong.email}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary">Thêm nhân viên</button>
      </form>
    </div>
  );
};

export default AddEmployee;

// import React, { useState } from 'react';

// const AddEmployee = () => {
//   const [employee, setEmployee] = useState({
//     Ma_nv: '',
//     Ho_ten_dem: '',
//     Ten: '',
//     Ngay_sinh: '',
//     SDT: '',
//     Loai_nhan_vien: '',
//     Bao_tri: {
//       dia_chi: '',
//     },              // Đặc biệt cho loại nhân viên bảo trì
//     Giao_hang: {
//       bang_lai: '',          // Đặc biệt cho loại nhân viên giao hàng
//       phuong_tien: '',
//     },
//     Van_phong: {
//       dia_chi: '',           // Đặc biệt cho loại nhân viên văn phòng
//       email: '',
//     }
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Cập nhật thông tin cho các thuộc tính riêng của mỗi loại nhân viên
//     if (name === 'Loai_nhan_vien') {
//       setEmployee({
//         ...employee,
//         Loai_nhan_vien: value,
//         Bao_tri: { dia_chi: ''},
//         Giao_hang: { bang_lai: '', phuong_tien: '' },
//         Van_phong: { dia_chi: '', email: '' },
//       });
//     } else if (name.startsWith('Giao_hang') || name.startsWith('Van_phong')) {
//       const [category, field] = name.split('.');
//       setEmployee({
//         ...employee,
//         [category]: {
//           ...employee[category],
//           [field]: value,
//         }
//       });
//     } else {
//       setEmployee({
//         ...employee,
//         [name]: value,
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!employee.Ma_nv || !employee.Ho_ten_dem || !employee.Ten || !employee.SDT || !employee.Ngay_sinh) {
//       alert('Vui lòng điền đầy đủ thông tin.');
//       return;
//     }

//     try {
//       const response = await fetch(process.env.REACT_APP_API_URL + '/nhanvien', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(employee),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert('Thêm nhân viên thành công!');
//         setEmployee({
//           Ma_nv: '',
//           Ho_ten_dem: '',
//           Ten: '',
//           Ngay_sinh: '',
//           SDT: '',
//           Loai_nhan_vien: '',
//           Bao_tri: { dia_chi: ''},
//           Giao_hang: { bang_lai: '', phuong_tien: '' },
//           Van_phong: { dia_chi: '', email: '' }
//         });
//       } else {
//         alert(data.message || 'Có lỗi xảy ra khi thêm nhân viên.');
//       }
//     } catch (error) {
//       console.error('Lỗi kết nối:', error);
//       alert('Không thể kết nối tới máy chủ.');
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2>Thêm Nhân Viên</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Ma_nv:</label>
//           <input
//             type="text"
//             className="form-control"
//             name="Ma_nv"
//             value={employee.Ma_nv}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Họ và tên đệm:</label>
//           <input
//             type="text"
//             className="form-control"
//             name="Ho_ten_dem"
//             value={employee.Ho_ten_dem}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Tên:</label>
//           <input
//             type="text"
//             className="form-control"
//             name="Ten"
//             value={employee.Ten}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Ngày sinh:</label>
//           <input
//             type="date"
//             className="form-control"
//             name="Ngay_sinh"
//             value={employee.Ngay_sinh}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Số điện thoại:</label>
//           <input
//             type="text"
//             className="form-control"
//             name="SDT"
//             value={employee.SDT}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Loại nhân viên:</label>
//           <select
//             className="form-control"
//             name="Loai_nhan_vien"
//             value={employee.Loai_nhan_vien}
//             onChange={handleChange}
//             required
//           >
//             <option value="bao_tri">Nhân viên bảo trì</option>
//             <option value="giao_hang">Nhân viên giao hàng</option>
//             <option value="van_phong">Nhân viên văn phòng</option>
//           </select>
//         </div>

//         {/* Các trường thông tin riêng cho từng loại nhân viên */}
//         {employee.Loai_nhan_vien === 'bao_tri' && (
//           <div className="form-group">
//             <label>Địa chỉ làm việc:</label>
//             <input
//               type="text"
//               className="form-control"
//               name="Bao_tri"
//               value={employee.Bao_tri.dia_chi}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         )}

//         {employee.Loai_nhan_vien === 'giao_hang' && (
//           <>
//             <div className="form-group">
//               <label>Bằng lái:</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="Giao_hang.bang_lai"
//                 value={employee.Giao_hang.bang_lai}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Phương tiện:</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="Giao_hang.phuong_tien"
//                 value={employee.Giao_hang.phuong_tien}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </>
//         )}

//         {employee.Loai_nhan_vien === 'van_phong' && (
//           <>
//             <div className="form-group">
//               <label>Địa chỉ làm việc:</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="Van_phong.dia_chi"
//                 value={employee.Van_phong.dia_chi}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Email:</label>
//               <input
//                 type="email"
//                 className="form-control"
//                 name="Van_phong.email"
//                 value={employee.Van_phong.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </>
//         )}

//         <button type="submit" className="btn btn-primary">Thêm nhân viên</button>
//       </form>
//     </div>
//   );
// };

// export default AddEmployee;
