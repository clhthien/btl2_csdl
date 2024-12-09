const express = require('express');
const router = express.Router();
const db = require('../config/db');  // Kết nối cơ sở dữ liệu

// Route GET để gọi hàm DemKienHangTheoLoaiHang
router.get('/count-items/:MaKho/:LoaiHang', async (req, res) => {
    const { MaKho, LoaiHang } = req.params;
  
    // Kiểm tra các tham số đầu vào
    if (!MaKho || !LoaiHang) {
      return res.status(400).json({ message: 'Thiếu tham số MaKho hoặc LoaiHang.' });
    }
  
    // Kiểm tra giá trị của LoaiHang có hợp lệ không
    if (!['Thường', 'Dễ vỡ'].includes(LoaiHang)) {
      return res.status(400).json({ message: 'Loại hàng phải là "Thường" hoặc "Dễ vỡ".' });
    }
  
    try {
      // Thực thi hàm DemKienHangTheoLoaiHang trong MySQL
      const query = 'SELECT DemKienHangTheoLoaiHang(?, ?) AS SoLuong';
      const [results] = await db.execute(query, [MaKho, LoaiHang]);
  
      // Kiểm tra kết quả trả về
      if (results && results.length > 0) {
        const soLuong = results[0].SoLuong;
        return res.status(200).json({ SoLuong: soLuong });
      } else {
        return res.status(404).json({ message: 'Không tìm thấy dữ liệu.' });
      }
    } catch (err) {
      console.error('Lỗi khi gọi hàm DemKienHangTheoLoaiHang:', err);
  
      // Xử lý lỗi đặc biệt từ MySQL (SQLSTATE '45000')
      if (err.sqlState === '45000') {
        return res.status(400).json({ message: err.sqlMessage });
      }
  
      // Các lỗi khác
      return res.status(500).json({ message: 'Có lỗi xảy ra khi gọi hàm trong MySQL.' });
    }
  });

// Route GET để gọi hàm TinhTongGiaTriKienHangTheoKhachHang
router.get('/total-value/:MaKhachHang', async (req, res) => {
  const { MaKhachHang } = req.params;

  // Kiểm tra tham số đầu vào
  if (!MaKhachHang) {
    return res.status(400).json({ message: 'Thiếu tham số MaKhachHang.' });
  }

  try {
    // Thực thi hàm TinhTongGiaTriKienHangTheoKhachHang trong MySQL
    const query = 'SELECT TinhTongGiaTriKienHangTheoKhachHang(?) AS TongGiaTri';
    const [results] = await db.execute(query, [MaKhachHang]);

    // Kiểm tra kết quả trả về
    if (results && results.length > 0) {
      const tongGiaTri = results[0].TongGiaTri;
      return res.status(200).json({ TongGiaTri: tongGiaTri });
    } else {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu.' });
    }
  } catch (err) {
    console.error('Lỗi khi gọi hàm TinhTongGiaTriKienHangTheoKhachHang:', err);

    // Xử lý lỗi đặc biệt khi khách hàng không tồn tại
    if (err.sqlMessage && err.sqlMessage === 'Khách hàng không tồn tại.') {
      // Gửi thông báo lỗi từ MySQL tới frontend
      return res.status(404).json({ message: 'Khách hàng không tồn tại.' });
    }

    // Các lỗi khác
    return res.status(500).json({ message: 'Có lỗi xảy ra khi gọi hàm trong MySQL.' });
  }
});

module.exports = router;
