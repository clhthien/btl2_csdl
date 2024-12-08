const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Hàm kiểm tra định dạng email
const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

const validatePhoneNumber = (SDT) => 
{
  const regex = /^(03|05|07|08|09)\d{8}$/; // Kiểm tra 10 chữ số
  return regex.test(SDT);
}
// Lấy tất cả khách hàng
router.get('/', async (req, res) => {
  const query = 'SELECT * FROM khach_hang';
  
  try {
    const [results] = await db.execute(query);  // Thực thi truy vấn
    if (results.length > 0) {
      res.json(results);  // Trả về tất cả đơn hàng
    } else {
      res.status(404).json({ message: 'Không có đơn hàng nào!' });
    }
  } catch (err) {
    console.error('Lỗi truy vấn:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi truy vấn đơn hàng.' });
  }
});
  //Lay khach hang theo id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM khach_hang WHERE Ma_khach_hang = ?';

  try {
    const [results, fields] = await db.execute(query, [id]);
    if (results.length > 0) {
      res.json(results[0]); // Trả về dữ liệu khách hàng đầu tiên
    } else {
      res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }
  } catch (err) {
    console.error('Lỗi truy vấn:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi truy vấn cơ sở dữ liệu.' });
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
  const checkQuery = `
    SELECT * FROM khach_hang WHERE Ma_khach_hang = ? OR SDT = ? OR Email = ?
  `;
  
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
      CALL AddKhachHang(?,?,?,?,?);
    `;
    const [results] = await db.execute(insertQuery, [Ma_khach_hang, Ho_ten_dem, Ten, SDT, Email]);

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
  const { Ma_khach_hang } = req.params;
  const { Ho_ten_dem, Ten, SDT, Email } = req.body;

  if (!Ho_ten_dem || !Ten || !SDT || !Email) {
    return res.status(400).json({ message: 'Thiếu thông tin khách hàng!' });
  }

  if (!validateEmail(Email)) {
    return res.status(400).json({ message: 'Email không hợp lệ!' });
  }
  if (!validatePhoneNumber(SDT)) {
    return res.status(400).json({ message: 'Số điện thoại không hợp lệ!' });
  }

  const checkMaKHQuery = 'SELECT * FROM khach_hang WHERE Ma_khach_hang = ?';
  try {
    const [existingMaKH] = await db.execute(checkMaKHQuery, [Ma_khach_hang]);
    if (existingMaKH.length === 0) {
      return res.status(404).json({ message: 'Mã khách hàng không tồn tại!' });
    }

    // Kiểm tra trùng số điện thoại và email
    const checkSDTQuery = 'SELECT * FROM khach_hang WHERE SDT = ? AND Ma_khach_hang != ?';
    const [existingSDT] = await db.execute(checkSDTQuery, [SDT, Ma_khach_hang]);
    if (existingSDT.length > 0) {
      return res.status(400).json({ message: 'Số điện thoại đã tồn tại!' });
    }

    const checkEmailQuery = 'SELECT * FROM khach_hang WHERE Email = ? AND Ma_khach_hang != ?';
    const [existingEmail] = await db.execute(checkEmailQuery, [Email, Ma_khach_hang]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ message: 'Email đã tồn tại!' });
    }

    // Cập nhật thông tin khách hàng
    const updateQuery = `
      UPDATE khach_hang
      SET Ho_ten_dem = ?, Ten = ?, SDT = ?, Email = ?
      WHERE Ma_khach_hang = ?
    `;
    await db.execute(updateQuery, [Ho_ten_dem, Ten, SDT, Email, Ma_khach_hang]);

    res.status(200).json({
      message: 'Cập nhật khách hàng thành công!',
      customer: {
        Ma_khach_hang,
        Ho_ten_dem,
        Ten,
        SDT,
        Email
      }
    });
  } catch (err) {
    console.error('Lỗi khi cập nhật khách hàng:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật khách hàng.' });
  }
});

// Xóa khách hàng
router.delete('/:Ma_khach_hang', async (req, res) => {
  const { Ma_khach_hang } = req.params;

  const checkMaKHQuery = 'SELECT * FROM khach_hang WHERE Ma_khach_hang = ?';
  try {
    const [existingMaKH] = await db.execute(checkMaKHQuery, [Ma_khach_hang]);
    if (existingMaKH.length === 0) {
      return res.status(404).json({ message: 'Mã khách hàng không tồn tại!' });
    }

    // Xóa khách hàng
    const deleteQuery = 'DELETE FROM khach_hang WHERE Ma_khach_hang = ?';
    await db.execute(deleteQuery, [Ma_khach_hang]);

    res.status(200).json({ message: 'Xóa khách hàng thành công!' });
  } catch (err) {
    console.error('Lỗi khi xóa khách hàng:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa khách hàng.' });
  }
});



module.exports = router;
