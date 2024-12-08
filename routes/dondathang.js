const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Hàm kiểm tra số điện thoại hợp lệ
const validatePhoneNumber = (SDT) => {
  const regex = /^(03|05|07|08|09)\d{8}$/; // Kiểm tra 10 chữ số theo định dạng Việt Nam
  return regex.test(SDT);
}
// 1. Tạo đơn đặt hàng (POST)
router.post('/', async (req, res) => { 
  const { Ma_ddh, Sdt_nguoi_gui, Sdt_nguoi_nhan, Ma_khach_hang  } = req.body;

  // Kiểm tra các trường dữ liệu
  if (!Ma_ddh || !Sdt_nguoi_gui || !Sdt_nguoi_nhan || !Ma_khach_hang) {
    return res.status(400).json({ message: 'Thiếu thông tin đơn hàng!' });
  }

  // Kiểm tra số điện thoại hợp lệ
  if (!validatePhoneNumber(Sdt_nguoi_gui) || !validatePhoneNumber(Sdt_nguoi_nhan)) {
    return res.status(400).json({ message: 'Số điện thoại không hợp lệ!' });
  }

  // Kiểm tra mã khách hàng có tồn tại không
  const checkMaKHQuery = 'SELECT * FROM khach_hang WHERE Ma_khach_hang = ?';
  try {
    const [existingMaKH] = await db.execute(checkMaKHQuery, [Ma_khach_hang]);
    if (existingMaKH.length === 0) {
      return res.status(404).json({ message: 'Mã khách hàng không tồn tại!' });
    }

    // Kiểm tra mã đơn hàng có tồn tại chưa
    const checkMaDDHQuery = 'SELECT * FROM don_dat_hang WHERE Ma_ddh = ?';
    const [existingData] = await db.execute(checkMaDDHQuery, [Ma_ddh]);
    if (existingData.length > 0) {
      return res.status(400).json({ message: 'Mã đơn hàng đã tồn tại!' });
    }

    // Thêm đơn đặt hàng mới vào cơ sở dữ liệu
    const query = `CALL AddDonDatHang(?, ?, ?, ?)`;
    await db.execute(query, [Ma_ddh, Sdt_nguoi_gui, Sdt_nguoi_nhan, Ma_khach_hang]);

    res.status(201).json({
      message: 'Tạo đơn hàng thành công!',
      don_dat_hang: { Ma_ddh, Sdt_nguoi_gui, Sdt_nguoi_nhan, Ma_khach_hang }
    });
  } catch (err) {
    console.error('Lỗi khi tạo đơn hàng:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi tạo đơn hàng.' });
  }
});


// 2. Lấy thông tin đơn hàng theo mã (GET)
router.get('/:Ma_ddh', async (req, res) => {
  const { Ma_ddh } = req.params;

  const query = 'SELECT * FROM don_dat_hang WHERE Ma_ddh = ?';

  try {
    const [results] = await db.execute(query, [Ma_ddh]);
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng với mã đã cho' });
    }
  } catch (err) {
    console.error('Lỗi truy vấn:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi truy vấn đơn hàng.' });
  }
});

// 3. Cập nhật thông tin đơn hàng (PUT)
router.put('/:Ma_ddh', async (req, res) => {
  const { Ma_ddh } = req.params;
  const { Sdt_nguoi_gui, Sdt_nguoi_nhan, Ma_khach_hang } = req.body;

  if (!Sdt_nguoi_gui || !Sdt_nguoi_nhan || !Ma_khach_hang) {
    return res.status(400).json({ message: 'Thiếu thông tin đơn hàng hoặc tuổi nhân viên!' });
  }
  if (!validatePhoneNumber(Sdt_nguoi_gui) || !validatePhoneNumber(Sdt_nguoi_nhan)) {
    return res.status(400).json({ message: 'Số điện thoại không hợp lệ!' });
  }

  // Kiểm tra mã khách hàng có tồn tại không
  const checkMaKHQuery = 'SELECT * FROM khach_hang WHERE Ma_khach_hang = ?';
  try {
    const [existingMaKH] = await db.execute(checkMaKHQuery, [Ma_khach_hang]);
    if (existingMaKH.length === 0) {
      return res.status(404).json({ message: 'Mã khách hàng không tồn tại!' });
    }

    // Kiểm tra đơn hàng có tồn tại không
    const checkMaDDHQuery = 'SELECT * FROM don_dat_hang WHERE Ma_ddh = ?';
    const [existingData] = await db.execute(checkMaDDHQuery, [Ma_ddh]);
    if (existingData.length === 0) {
      return res.status(404).json({ message: 'Mã đơn hàng không tồn tại!' });
    }

    // Cập nhật thông tin đơn hàng
    const updateQuery = `
      UPDATE don_dat_hang
      SET Sdt_nguoi_gui = ?, Sdt_nguoi_nhan = ?, Ma_khach_hang = ?
      WHERE Ma_ddh = ?
    `;
    await db.execute(updateQuery, [Sdt_nguoi_gui, Sdt_nguoi_nhan, Ma_khach_hang, Ma_ddh]);

    res.status(200).json({
      message: 'Cập nhật đơn hàng thành công!',
      don_dat_hang: { Ma_ddh, Sdt_nguoi_gui, Sdt_nguoi_nhan, Ma_khach_hang}
    });
  } catch (err) {
    console.error('Lỗi khi cập nhật đơn hàng:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật đơn hàng.' });
  }
});

// 4. Xóa đơn hàng (DELETE)
router.delete('/:Ma_ddh', async (req, res) => {
  const { Ma_ddh } = req.params;

  // Kiểm tra đơn hàng có tồn tại không
  const checkMaDDHQuery = 'SELECT * FROM don_dat_hang WHERE Ma_ddh = ?';
  try {
    const [existingMaDDH] = await db.execute(checkMaDDHQuery, [Ma_ddh]);
    if (existingMaDDH.length === 0) {
      return res.status(404).json({ message: 'Mã đơn hàng không tồn tại!' });
    }

    // Xóa đơn hàng
    const deleteQuery = 'DELETE FROM don_dat_hang WHERE Ma_ddh = ?';
    await db.execute(deleteQuery, [Ma_ddh]);

    res.status(200).json({ message: 'Xóa đơn hàng thành công!' });
  } catch (err) {
    console.error('Lỗi khi xóa đơn hàng:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa đơn hàng.' });
  }
});

router.get('/', async (req, res) => {
  const query = 'SELECT * FROM don_dat_hang';  // Truy vấn lấy tất cả đơn đặt hàng

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
module.exports = router;
