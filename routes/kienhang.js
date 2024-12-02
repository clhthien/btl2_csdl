const express = require('express');
const router = express.Router();
const db = require('../config/db');  // Kết nối cơ sở dữ liệu

// Route POST để thêm thông tin vào cơ sở dữ liệu
router.post('/', async (req, res) => {
  const { Ma_kih, Kich_thuoc, Loai_hang, Can_nang, Gt_kien_hang, Ma_ddh, Ma_kho } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!Ma_kih || !Kich_thuoc || !Loai_hang || !Can_nang || !Gt_kien_hang || !Ma_ddh || !Ma_kho) {
    return res.status(400).json({ message: 'Thiếu thông tin cần thiết!' });
  }

  // Kiểm tra xem mã kho đã tồn tại trong cơ sở dữ liệu
  const checkMaKhoQuery = 'SELECT * FROM kho_hang WHERE Ma_kho = ?';
  try {
    const [existingMaKho] = await db.execute(checkMaKhoQuery, [Ma_kho]);
    if (existingMaKho.length === 0) {
      return res.status(404).json({ message: 'Mã kho không tồn tại!' });
    }

    // Thêm dữ liệu vào cơ sở dữ liệu
    const insertQuery = `
      INSERT INTO kien_hang (Ma_kih, Kich_thuoc, Loai_hang, Can_nang, Gt_kien_hang, Ma_ddh, Ma_kho)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await db.execute(insertQuery, [Ma_kih, Kich_thuoc, Loai_hang, Can_nang, Gt_kien_hang, Ma_ddh, Ma_kho]);

    // Trả về kết quả thành công
    res.status(201).json({
      message: 'Thêm kiện hàng thành công!',
      kien_hang: { Ma_kih, Kich_thuoc, Loai_hang, Can_nang, Gt_kien_hang, Ma_ddh, Ma_kho }
    });
  } catch (err) {
    console.error('Lỗi khi thêm kiện hàng:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi thêm kiện hàng.' });
  }
});

router.get('/', async (req, res) => {
  const query = 'SELECT * FROM kien_hang';

  try {
    const [result] = await db.execute(query);  // Sử dụng result thay vì results
    if (result.length > 0) {
      res.json(result);  // Trả về tất cả kiện hàng
    } else {
      res.status(404).json({ message: 'Không có kiện hàng nào!' });
    }
  } catch (err) {
    console.error('Lỗi truy vấn:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi truy vấn kiện hàng.' });
  }
});


module.exports = router;


