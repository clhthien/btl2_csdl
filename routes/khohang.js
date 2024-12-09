const express = require('express');
const router = express.Router();
const db = require('../config/db');  // Giả sử bạn đã cấu hình kết nối cơ sở dữ liệu ở đây

// 1. Tạo kho hàng mới (POST)
router.post('/', async (req, res) => {
  const { Ma_kho, Dia_chi, Suc_chua_toi_da, So_luong_kien_hang } = req.body;

  // Kiểm tra thông tin đầu vào
  if (!Ma_kho || !Dia_chi || !Suc_chua_toi_da || !So_luong_kien_hang) {
    return res.status(400).json({ message: 'Thiếu thông tin kho hàng!' });
  }

  // Kiểm tra số lượng kiện hàng không vượt sức chứa tối đa
  if (So_luong_kien_hang > Suc_chua_toi_da) {
    return res.status(400).json({ message: 'Số lượng kiện hàng vượt quá sức chứa tối đa của kho!' });
  }

  // Kiểm tra mã kho đã tồn tại chưa
  const checkMaKhoQuery = 'SELECT * FROM kho_hang WHERE Ma_kho = ?';
  const checkDiaChiQuery = 'SELECT * FROM kho_hang WHERE Dia_chi = ?';
  try {
    const [existingMaKho] = await db.execute(checkMaKhoQuery, [Ma_kho]);
    if (existingMaKho.length > 0) {
      return res.status(400).json({ message: 'Mã kho đã tồn tại!' });
    }

    const [existingDiaChi] = await db.execute(checkDiaChiQuery, [Dia_chi]);
    if (existingDiaChi.length > 0) {
      return res.status(400).json({ message: 'Địa chỉ đã được đăng ký' });
    }

    // Gọi stored procedure AddKhoHang để thêm kho hàng mới
    const query = 'CALL AddKhoHang(?, ?, ?, ?)';
    await db.execute(query, [Ma_kho, Dia_chi, Suc_chua_toi_da, So_luong_kien_hang]);

    res.status(201).json({
      message: 'Tạo kho hàng thành công!',
      kho_hang: {
        Ma_kho,
        Dia_chi,
        Suc_chua_toi_da,
        So_luong_kien_hang
      }
    });
  } catch (err) {
    console.error('Lỗi khi tạo kho hàng:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi tạo kho hàng.' });
  }
});

// 2. Lấy thông tin kho hàng theo mã (GET)
router.get('/:Ma_kho', async (req, res) => 
{
  const { Ma_kho } = req.params;

  const query = 'SELECT * FROM kho_hang WHERE Ma_kho = ?';

  try {
    const [results] = await db.execute(query, [Ma_kho]);

    if (results.length > 0) {
      // Nếu tìm thấy, trả về kho hàng đầu tiên
      res.status(200).json(results[0]);
    } else {
      // Nếu không tìm thấy, trả về thông báo lỗi
      res.status(404).json({ message: 'Không tìm thấy kho hàng với mã đã cho!' });
    }
  } catch (err) {
    console.error('Lỗi truy vấn:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi truy vấn kho hàng.' });
  }
});

// 3. Cập nhật thông tin kho hàng (PUT)
router.put('/:Ma_kho', async (req, res) => {
  const { Ma_kho } = req.params; // Lấy mã kho từ tham số URL
  const { Dia_chi, So_luong_kien_hang } = req.body; // Lấy dữ liệu từ body request

  // Kiểm tra xem các trường cần thiết có đầy đủ không
  if (!Dia_chi || So_luong_kien_hang === undefined) {
    return res.status(400).json({ message: 'Thiếu thông tin kho hàng!' });
  }

  try {
    // Truy vấn sức chứa tối đa của kho hàng từ cơ sở dữ liệu
    const getSucChuaQuery = 'SELECT Suc_chua_toi_da FROM kho_hang WHERE Ma_kho = ?';
    const [sucChuaResult] = await db.execute(getSucChuaQuery, [Ma_kho]);

    if (sucChuaResult.length === 0) {
      return res.status(404).json({ message: 'Mã kho không tồn tại!' });
    }

    const { Suc_chua_toi_da } = sucChuaResult[0];

    // Kiểm tra số lượng kiện hàng không vượt sức chứa tối đa
    if (So_luong_kien_hang > Suc_chua_toi_da) {
      return res.status(400).json({ message: 'Số lượng kiện hàng vượt quá sức chứa tối đa của kho!' });
    }

    // Gọi stored procedure UpdateKhoHang để cập nhật thông tin kho hàng
    const query = 'CALL UpdateKhoHang(?, ?, ?, ?)';
    await db.execute(query, [Ma_kho, Dia_chi, Suc_chua_toi_da, So_luong_kien_hang]);

    res.status(200).json({
      message: 'Cập nhật kho hàng thành công!',
      kho_hang: {
        Ma_kho,
        Dia_chi,
        Suc_chua_toi_da,
        So_luong_kien_hang
      }
    });
  } catch (err) {
    console.error('Lỗi khi cập nhật kho hàng:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật kho hàng.' });
  }
});

// 4. Xóa kho hàng (DELETE)
router.delete('/:Ma_kho', async (req, res) => 
{
  const { Ma_kho } = req.params;

  try {
    // Gọi stored procedure DeleteKhoHang để xóa kho hàng và dữ liệu liên quan
    const query = 'CALL DeleteKhoHang(?)';
    await db.execute(query, [Ma_kho]);

    res.status(200).json({ message: 'Xóa kho hàng và dữ liệu liên quan thành công!' });
  } catch (err) {
    // Xử lý lỗi nếu stored procedure gửi tín hiệu lỗi
    if (err.sqlState === '45000') {
      res.status(404).json({ message: err.sqlMessage }); // Lỗi "Kho hàng không tồn tại."
    } else {
      console.error('Lỗi khi xóa kho hàng:', err);
      res.status(500).json({ message: 'Có lỗi xảy ra khi xóa kho hàng.' });
    }
  }
});

// 5. Lấy tất cả kho hàng (GET)
router.get('/', async (req, res) => {
    const query = 'SELECT * FROM kho_hang';  // Truy vấn lấy tất cả kho hàng

    try {
    const [results] = await db.execute(query);  // Thực thi truy vấn
    if (results.length > 0) {
        res.json(results);  // Trả về tất cả kho hàng
    } else {
        res.status(404).json({ message: 'Không có kho hàng nào!' });
    }
    } catch (err) {
    console.error('Lỗi truy vấn:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi truy vấn kho hàng.' });
    }
});
    


module.exports = router;
