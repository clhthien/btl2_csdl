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

    // Gọi stored procedure AddKienHang để thêm kiện hàng
    const query = 'CALL AddKienHang(?, ?, ?, ?, ?, ?, ?)';
    await db.execute(query, [Ma_kih, Kich_thuoc, Loai_hang, Can_nang, Gt_kien_hang, Ma_ddh, Ma_kho]);

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

router.put('/:Ma_kih', async (req, res) => {
  const { Ma_kih } = req.params; // Lấy mã kiện hàng từ URL parameter
  const { Kich_thuoc, Loai_hang, Can_nang, Gt_kien_hang, Ma_ddh, Ma_kho } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!Kich_thuoc || !Loai_hang || !Can_nang || !Gt_kien_hang || !Ma_ddh || !Ma_kho) {
    return res.status(400).json({ message: 'Thiếu thông tin cần thiết để cập nhật!' });
  }

  try {
    // Gọi stored procedure `UpdateKienHang` để cập nhật kiện hàng
    const query = 'CALL UpdateKienHang(?, ?, ?, ?, ?, ?, ?)';
    await db.execute(query, [Ma_kih, Kich_thuoc, Loai_hang, Can_nang, Gt_kien_hang, Ma_ddh, Ma_kho]);

    // Trả về kết quả thành công
    res.status(200).json({
      message: 'Cập nhật kiện hàng thành công!',
      kien_hang: {
        Ma_kih,
        Kich_thuoc,
        Loai_hang,
        Can_nang,
        Gt_kien_hang,
        Ma_ddh,
        Ma_kho,
      },
    });
  } catch (err) {
    console.error('Lỗi khi cập nhật kiện hàng:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật kiện hàng.' });
  }
});


router.get('/:Ma_kih', async (req, res) => {
  const { Ma_kih } = req.params;

  // Kiểm tra mã kiện hàng có tồn tại trong cơ sở dữ liệu
  const query = 'SELECT * FROM kien_hang WHERE Ma_kih = ?';
  try {
    const [result] = await db.execute(query, [Ma_kih]);

    // Nếu tìm thấy kiện hàng
    if (result.length > 0) {
      res.status(200).json(result[0]); // Trả về thông tin kiện hàng đầu tiên
    } else {
      res.status(404).json({ message: 'Không tìm thấy kiện hàng với mã đã cho!' });
    }
  } catch (err) {
    console.error('Lỗi truy vấn:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi truy vấn kiện hàng.' });
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
router.get('/khachhang/:Ma_khach_hang', async (req, res) => {
  const { Ma_khach_hang } = req.params;

  // Kiểm tra nếu mã khách hàng không được cung cấp
  if (!Ma_khach_hang) {
    return res.status(400).json({ message: 'Thiếu mã khách hàng!' });
  }

  try {
    // Gọi stored procedure Lay_Kien_Hang_Theo_Khach_Hang
    const query = 'CALL Lay_Kien_Hang_Theo_Khach_Hang(?)';
    const [result] = await db.execute(query, [Ma_khach_hang]);

    // Nếu không có kết quả, trả về thông báo
    if (result.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy kiện hàng cho mã khách hàng đã cho!' });
    }

    // Trả về kết quả từ stored procedure
    res.status(200).json(result[0]);
  } catch (err) {
    console.error('Lỗi khi lấy thông tin kiện hàng theo mã khách hàng:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thông tin kiện hàng.' });
  }
});
router.delete('/:Ma_kih', async (req, res) => {
  const { Ma_kih } = req.params;

  // Kiểm tra nếu mã kiện hàng không được cung cấp
  if (!Ma_kih) {
    return res.status(400).json({ message: 'Thiếu mã kiện hàng!' });
  }

  try {
    // Kiểm tra xem mã kiện hàng có tồn tại hay không
    const checkMaKihQuery = 'SELECT * FROM kien_hang WHERE Ma_kih = ?';
    const [existingMaKih] = await db.execute(checkMaKihQuery, [Ma_kih]);
    if (existingMaKih.length === 0) {
      return res.status(404).json({ message: 'Mã kiện hàng không tồn tại!' });
    }

    // Gọi stored procedure DeleteKienHang để xóa kiện hàng
    const deleteQuery = 'CALL DeleteKienHang(?)';
    await db.execute(deleteQuery, [Ma_kih]);

    res.status(200).json({ message: 'Xóa kiện hàng thành công!' });
  } catch (err) {
    console.error('Lỗi khi xóa kiện hàng:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa kiện hàng.' });
  }
});





module.exports = router;


