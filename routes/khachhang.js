const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Hàm kiểm tra định dạng email
const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

// Hàm kiểm tra số điện thoại hợp lệ
const validatePhoneNumber = (SDT) => {
  const regex = /^(03|05|07|08|09)\d{8}$/; // Kiểm tra số điện thoại 10-11 chữ số
  return regex.test(SDT);
};

// Lấy tất cả khách hàng
router.get('/', async (req, res) => {
  const query = 'SELECT * FROM khach_hang';

  try {
    const [results] = await db.execute(query);
    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).json({ message: 'Không có khách hàng nào!' });
    }
  } catch (err) {
    console.error('Lỗi truy vấn:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi truy vấn dữ liệu khách hàng.' });
  }
});

// Lấy khách hàng theo mã khách hàng
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM khach_hang WHERE Ma_khach_hang = ?';

  try {
    const [results] = await db.execute(query, [id]);
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }
  } catch (err) {
    console.error('Lỗi truy vấn:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi truy vấn dữ liệu khách hàng.' });
  }
});

// Lấy danh sách khách hàng có tổng giá trị kiện hàng >= GiaTri
router.get('/tonggiatri/:GiaTri', async (req, res) => {
  const { GiaTri } = req.params;

  // Kiểm tra tham số GiaTri
  if (!GiaTri || isNaN(GiaTri)) {
    return res.status(400).json({ message: 'Giá trị không hợp lệ!' });
  }

  try {
    // Gọi stored procedure Lay_Khach_Hang_Tong_Gia_Tri
    const query = 'CALL Lay_Khach_Hang_Tong_Gia_Tri(?)';
    const [result] = await db.execute(query, [GiaTri]);

    // Nếu không có kết quả, trả về thông báo
    if (result.length === 0) {
      return res.status(404).json({ message: 'Không có khách hàng nào với tổng giá trị đủ điều kiện!' });
    }

    // Trả về kết quả
    res.status(200).json(result[0]);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách khách hàng theo tổng giá trị:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách khách hàng.' });
  }
});

// Thêm khách hàng mới
router.post('/', async (req, res) => {
  const { Ma_khach_hang, Ho_ten_dem, Ten, SDT, Email } = req.body;

  // Kiểm tra xem có thiếu thông tin nào không
  if (!Ma_khach_hang || !Ho_ten_dem || !Ten || !SDT || !Email) {
    return res.status(400).json({ message: 'Thiếu thông tin khách hàng!' });
  }

  // Kiểm tra email và số điện thoại hợp lệ
  if (!validateEmail(Email)) {
    return res.status(400).json({ message: 'Email không hợp lệ!' });
  }

  if (!validatePhoneNumber(SDT)) {
    return res.status(400).json({ message: 'Số điện thoại không hợp lệ!' });
  }

  // Kiểm tra xem Mã khách hàng, Số điện thoại và Email có tồn tại không
  const checkQuery = `SELECT * FROM khach_hang WHERE Ma_khach_hang = ? OR SDT = ? OR Email = ?`;

  try {
    const [existingData] = await db.execute(checkQuery, [Ma_khach_hang, SDT, Email]);

    // Kiểm tra nếu có khách hàng trùng mã khách hàng, số điện thoại hoặc email
    if (existingData.length > 0) {
      let message = '';
      if (existingData.some(item => item.Ma_khach_hang === Ma_khach_hang)) {
        message = 'Mã khách hàng đã tồn tại!';
      } else if (existingData.some(item => item.SDT === SDT)) {
        message = 'Số điện thoại đã tồn tại!';
      } else if (existingData.some(item => item.Email === Email)) {
        message = 'Email đã tồn tại!';
      }
      return res.status(400).json({ message });
    }

    // Thêm khách hàng mới vào cơ sở dữ liệu
    const insertQuery = `
      CALL AddKhachHang(?, ?, ?, ?, ?)
    `;
    await db.execute(insertQuery, [Ma_khach_hang, Ho_ten_dem, Ten, SDT, Email]);

    res.status(201).json({
      message: 'Thêm khách hàng thành công!',
      customer: {
        Ma_khach_hang,
        Ho_ten_dem,
        Ten,
        SDT,
        Email
      }
    });
  } catch (err) {
    console.error('Lỗi khi thêm khách hàng:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi thêm khách hàng.' });
  }
});

// Cập nhật thông tin khách hàng
router.put('/:Ma_khach_hang', async (req, res) => {
  const { Ma_khach_hang } = req.params; // Lấy mã khách hàng từ URL parameter
  const { Ho_ten_dem, Ten, SDT, Email } = req.body; // Lấy dữ liệu từ body request

  // Kiểm tra xem các trường cần thiết có đầy đủ không
  if (!Ho_ten_dem || !Ten || !SDT || !Email) {
    return res.status(400).json({ message: 'Thiếu thông tin khách hàng!' });
  }

  // Kiểm tra định dạng email và số điện thoại
  if (!validateEmail(Email)) {
    return res.status(400).json({ message: 'Email không hợp lệ!' });
  }

  if (!validatePhoneNumber(SDT)) {
    return res.status(400).json({ message: 'Số điện thoại không hợp lệ!' });
  }

  try {
    // Gọi stored procedure `UpdateKhachHang` để cập nhật thông tin khách hàng
    const query = 'CALL UpdateKhachHang(?, ?, ?, ?, ?)';
    await db.execute(query, [Ma_khach_hang, Ho_ten_dem, Ten, SDT, Email]);

    // Trả về kết quả thành công
    res.status(200).json({
      message: 'Cập nhật khách hàng thành công!',
      customer: {
        Ma_khach_hang,
        Ho_ten_dem,
        Ten,
        SDT,
        Email,
      },
    });
  } catch (err) {
    // Xử lý lỗi từ stored procedure
    if (err.sqlState === '45000') {
      return res.status(400).json({ message: err.sqlMessage }); // Lỗi do stored procedure gửi tín hiệu
    }
    console.error('Lỗi khi cập nhật khách hàng:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật khách hàng.' });
  }
});


// Xóa khách hàng
// Xóa khách hàng và các dữ liệu liên quan
router.delete('/:Ma_khach_hang', async (req, res) => {
  const { Ma_khach_hang } = req.params;

  // Kiểm tra nếu mã khách hàng không được cung cấp
  if (!Ma_khach_hang) {
    return res.status(400).json({ message: 'Thiếu mã khách hàng!' });
  }

  try {
    // Gọi stored procedure DeleteKhachHang
    const query = 'CALL DeleteKhachHang(?)';
    await db.execute(query, [Ma_khach_hang]);

    res.status(200).json({ message: 'Xóa khách hàng và các dữ liệu liên quan thành công!' });
  } catch (err) {
    // Xử lý lỗi nếu stored procedure gửi tín hiệu lỗi
    if (err.sqlState === '45000') {
      res.status(404).json({ message: err.sqlMessage });
    } else {
      console.error('Lỗi khi xóa khách hàng:', err);
      res.status(500).json({ message: 'Có lỗi xảy ra khi xóa khách hàng.' });
    }
  }
});





module.exports = router;
