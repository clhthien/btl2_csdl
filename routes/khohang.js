const express = require('express');
const router = express.Router();
const db = require('../config/db');  // Giả sử bạn đã cấu hình kết nối cơ sở dữ liệu ở đây

// 1. Tạo kho hàng mới (POST)
router.post('/', async (req, res) => {
  const { Ma_kho, Dia_chi, Suc_chua } = req.body;

  // Kiểm tra thông tin đầu vào
  if (!Ma_kho || !Dia_chi || !Suc_chua) {
    return res.status(400).json({ message: 'Thiếu thông tin kho hàng!' });
  }

  // Kiểm tra mã kho đã tồn tại chưa
  const checkMaKhoQuery = 'SELECT * FROM kho_hang WHERE Ma_kho = ?';
  const checkDiaChiQuery = 'SELECT * FROM kho_hang WHERE Dia_chi = ?';
  try 
  {
    const [existingMaKho] = await db.execute(checkMaKhoQuery, [Ma_kho]);
    if (existingMaKho.length > 0) {
      return res.status(400).json({ message: 'Mã kho đã tồn tại!' });
    }
    const [existingDiaChi] = await db.execute(checkDiaChiQuery, [Ma_kho]);
    if ( existingDiaChi.length > 0 )
    {
      return res.status(404).json({message: 'Địa chỉ đã được đăng kí' })
    }

    // Thêm kho hàng mới
    const query = `
      INSERT INTO kho_hang (Ma_kho, Dia_chi, Suc_chua)
      VALUES (?, ?, ?)
    `;
    await db.execute(query, [Ma_kho, Dia_chi, Suc_chua]);

    res.status(201).json({
      message: 'Tạo kho hàng thành công!',
      kho_hang: {
        Ma_kho,
        Dia_chi,
        Suc_chua
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
    if (results.length === 0) {
      res.json(results[0]);  // Trả về kho hàng đầu tiên tìm thấy
    } else {
      res.status(404).json({ message: 'Không tìm thấy kho hàng' });
    }
  } catch (err) {
    console.error('Lỗi truy vấn:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi truy vấn kho hàng.' });
  }
});

// 3. Cập nhật thông tin kho hàng (PUT)
router.put('/:Ma_kho', async (req, res) => {
  const { Ma_kho } = req.params;
  const { Dia_chi, Suc_chua } = req.body;

  if (!Dia_chi || !Suc_chua) {
    return res.status(400).json({ message: 'Thiếu thông tin kho hàng!' });
  }

  // Kiểm tra kho hàng có tồn tại không
  const checkMaKhoQuery = 'SELECT * FROM kho_hang WHERE Ma_kho = ?';
  const checkDiaChiQuery = 'SELECT * FROM kho_hang WHERE Dia_chi = ?';
  try {
    const [existingMaKho] = await db.execute(checkMaKhoQuery, [Ma_kho]);
    if (existingMaKho.length > 0) {
      return res.status(404).json({ message: 'Mã kho đã tồn tại!' });
    }
    const [existingDiaChi] = await db.execute(checkDiaChiQuery, [Ma_kho]);
    if ( existingDiaChi.length > 0 )
    {
      return res.status(404).json({message: 'Địa chỉ đã được đăng kí' })
    }

    // Cập nhật thông tin kho hàng
    const updateQuery = `
      UPDATE kho_hang
      SET Dia_chi = ?, Suc_chua = ?
      WHERE Ma_kho = ?
    `;
    await db.execute(updateQuery, [Dia_chi, Suc_chua, Ma_kho]);

    res.status(200).json({
      message: 'Cập nhật kho hàng thành công!',
      kho_hang: {
        Ma_kho,
        Dia_chi,
        Suc_chua
      }
    });
  } catch (err) {
    console.error('Lỗi khi cập nhật kho hàng:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật kho hàng.' });
  }
});

// 4. Xóa kho hàng (DELETE)
router.delete('/:Ma_kho', async (req, res) => {
  const { Ma_kho } = req.params;

  // Kiểm tra kho hàng có tồn tại không
  const checkMaKhoQuery = 'SELECT * FROM kho_hang WHERE Ma_kho = ?';
  try {
    const [existingMaKho] = await db.execute(checkMaKhoQuery, [Ma_kho]);
    if (existingMaKho.length === 0) {
      return res.status(404).json({ message: 'Mã kho không tồn tại!' });
    }

    // Xóa kho hàng
    const deleteQuery = 'DELETE FROM kho_hang WHERE Ma_kho = ?';
    await db.execute(deleteQuery, [Ma_kho]);

    res.status(200).json({ message: 'Xóa kho hàng thành công!' });
  } catch (err) {
    console.error('Lỗi khi xóa kho hàng:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa kho hàng.' });
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
