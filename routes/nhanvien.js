// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');

// // Hàm kiểm tra định dạng số điện thoại
// const validatePhoneNumber = (sdt) => {
//   const regex = /^[0-9]{10,15}$/; // Kiểm tra số điện thoại hợp lệ (từ 10 đến 15 chữ số)
//   return regex.test(sdt);
// };

// // Lấy tất cả nhân viên
// router.get('/', async (req, res) => {
//   const query = 'SELECT * FROM nhan_vien';

//   try {
//     const [results, fields] = await db.execute(query);
//     res.json(results);
//   } catch (err) {
//     console.error('Lỗi truy vấn:', err);
//     res.status(500).json({ message: 'Có lỗi xảy ra khi truy vấn cơ sở dữ liệu.' });
//   }
// });

// // Lấy nhân viên theo mã nhân viên
// router.get('/:id', async (req, res) => {
//   const { id } = req.params;
//   const query = 'SELECT * FROM nhan_vien WHERE Ma_nv = ?';

//   try {
//     const [results, fields] = await db.execute(query, [id]);
//     if (results.length > 0) {
//       res.json(results[0]); // Trả về nhân viên đầu tiên
//     } else {
//       res.status(404).json({ message: 'Không tìm thấy nhân viên' });
//     }
//   } catch (err) {
//     console.error('Lỗi truy vấn:', err);
//     res.status(500).json({ message: 'Có lỗi xảy ra khi truy vấn cơ sở dữ liệu.' });
//   }
// });

// // Thêm nhân viên mới
// router.post('/', async (req, res) => {
//   const { Ma_nv, Ho_ten_dem, Ten, Ngay_sinh, SDT } = req.body;

//   if (!Ma_nv || !Ho_ten_dem || !Ten || !Ngay_sinh || !SDT) {
//     return res.status(400).json({ message: 'Thiếu thông tin nhân viên!' });
//   }

//   if (!validatePhoneNumber(SDT)) {
//     return res.status(400).json({ message: 'Số điện thoại không hợp lệ!' });
//   }

//   const checkMaNVQuery = 'SELECT * FROM nhan_vien WHERE Ma_nv = ?';
//   try {
//     const [existingMaNV] = await db.execute(checkMaNVQuery, [Ma_nv]);
//     if (existingMaNV.length > 0) {
//       return res.status(400).json({ message: 'Mã nhân viên đã tồn tại!' });
//     }

//     const checkSDTQuery = 'SELECT * FROM nhan_vien WHERE SDT = ?';
//     const [existingSDT] = await db.execute(checkSDTQuery, [SDT]);
//     if (existingSDT.length > 0) {
//       return res.status(400).json({ message: 'Số điện thoại đã tồn tại!' });
//     }

//     const query = `
//       INSERT INTO nhan_vien (Ma_nv, Ho_ten_dem, Ten, Ngay_sinh, SDT) 
//       VALUES (?, ?, ?, ?, ?)
//     `;

//     const [results] = await db.execute(query, [Ma_nv, Ho_ten_dem, Ten, Ngay_sinh, SDT]);

//     res.status(201).json({
//       message: 'Thêm nhân viên thành công!',
//       employee: {
//         Ma_nv,
//         Ho_ten_dem,
//         Ten,
//         Ngay_sinh,
//         SDT
//       }
//     });
//   } catch (err) {
//     console.error('Lỗi khi thêm nhân viên:', err);
//     res.status(500).json({ message: 'Có lỗi xảy ra khi thêm nhân viên.' });
//   }
// });

// // Cập nhật thông tin nhân viên
// router.put('/:Ma_nv', async (req, res) => {
//   const { Ma_nv } = req.params;
//   const { Ho_ten_dem, Ten, Ngay_sinh, SDT } = req.body;

//   if (!Ho_ten_dem || !Ten || !Ngay_sinh || !SDT) {
//     return res.status(400).json({ message: 'Thiếu thông tin nhân viên!' });
//   }

//   if (!validatePhoneNumber(SDT)) {
//     return res.status(400).json({ message: 'Số điện thoại không hợp lệ!' });
//   }

//   const checkMaNVQuery = 'SELECT * FROM nhan_vien WHERE Ma_nv = ?';
//   try {
//     const [existingMaNV] = await db.execute(checkMaNVQuery, [Ma_nv]);
//     if (existingMaNV.length === 0) {
//       return res.status(404).json({ message: 'Mã nhân viên không tồn tại!' });
//     }

//     // Kiểm tra trùng số điện thoại
//     const checkSDTQuery = 'SELECT * FROM nhan_vien WHERE SDT = ? AND Ma_nv != ?';
//     const [existingSDT] = await db.execute(checkSDTQuery, [SDT, Ma_nv]);
//     if (existingSDT.length > 0) {
//       return res.status(400).json({ message: 'Số điện thoại đã tồn tại!' });
//     }

//     // Cập nhật thông tin nhân viên
//     const updateQuery = `
//       UPDATE nhan_vien
//       SET Ho_ten_dem = ?, Ten = ?, Ngay_sinh = ?, SDT = ?
//       WHERE Ma_nv = ?
//     `;
//     await db.execute(updateQuery, [Ho_ten_dem, Ten, Ngay_sinh, SDT, Ma_nv]);

//     res.status(200).json({
//       message: 'Cập nhật nhân viên thành công!',
//       employee: {
//         Ma_nv,
//         Ho_ten_dem,
//         Ten,
//         Ngay_sinh,
//         SDT
//       }
//     });
//   } catch (err) {
//     console.error('Lỗi khi cập nhật nhân viên:', err);
//     res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật nhân viên.' });
//   }
// });

// // Xóa nhân viên
// router.delete('/:Ma_nv', async (req, res) => {
//   const { Ma_nv } = req.params;

//   const checkMaNVQuery = 'SELECT * FROM nhan_vien WHERE Ma_nv = ?';
//   try {
//     const [existingMaNV] = await db.execute(checkMaNVQuery, [Ma_nv]);
//     if (existingMaNV.length === 0) {
//       return res.status(404).json({ message: 'Mã nhân viên không tồn tại!' });
//     }

//     // Xóa nhân viên
//     const deleteQuery = 'DELETE FROM nhan_vien WHERE Ma_nv = ?';
//     await db.execute(deleteQuery, [Ma_nv]);

//     res.status(200).json({ message: 'Xóa nhân viên thành công!' });
//   } catch (err) {
//     console.error('Lỗi khi xóa nhân viên:', err);
//     res.status(500).json({ message: 'Có lỗi xảy ra khi xóa nhân viên.' });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Hàm kiểm tra định dạng số điện thoại
const validatePhoneNumber = (sdt) => {
    const regex = /^[0-9]{10,15}$/; // Kiểm tra số điện thoại hợp lệ (từ 10 đến 15 chữ số)
    return regex.test(sdt);
};

// Lấy tất cả nhân viên
router.get('/', async (req, res) => {
    const query = 'SELECT * FROM nhan_vien';
    try {
        const [results] = await db.execute(query);
        res.json(results);
    } catch (err) {
        console.error('Lỗi truy vấn:', err);
        res.status(500).json({ message: 'Có lỗi xảy ra khi truy vấn cơ sở dữ liệu.' });
    }
});

// Lấy nhân viên theo mã nhân viên
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM nhan_vien WHERE Ma_nv = ?';
    try {
        const [results] = await db.execute(query, [id]);
        if (results.length > 0) {
            const employee = results[0];
            // Lấy thêm thông tin từ các bảng kế thừa nếu có
            let additionalInfo = {};
            const { Loai_nhan_vien } = employee;

            if (Loai_nhan_vien === 'bao_tri') {
                const queryBaoTri = 'SELECT * FROM nhan_vien_bao_tri WHERE Ma_nvbt = ?';
                additionalInfo = await db.execute(queryBaoTri, [id]);
            } else if (Loai_nhan_vien === 'giao_hang') {
                const queryGiaoHang = 'SELECT * FROM nhan_vien_giao_hang WHERE Ma_nvgh = ?';
                additionalInfo = await db.execute(queryGiaoHang, [id]);
            } else if (Loai_nhan_vien === 'van_phong') {
                const queryVanPhong = 'SELECT * FROM nhan_vien_van_phong WHERE Ma_nvvp = ?';
                additionalInfo = await db.execute(queryVanPhong, [id]);
            }

            res.json({ employee, additionalInfo });
        } else {
            res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        }
    } catch (err) {
        console.error('Lỗi truy vấn:', err);
        res.status(500).json({ message: 'Có lỗi xảy ra khi truy vấn cơ sở dữ liệu.' });
    }
});

// Thêm nhân viên mới
router.post('/', async (req, res) => {
    const { Ma_nv, Ho_ten_dem, Ten, Ngay_sinh, SDT, Loai_nhan_vien, Bao_tri, Giao_hang, Van_phong } = req.body;

    if (!Ma_nv || !Ho_ten_dem || !Ten || !Ngay_sinh || !SDT || !Loai_nhan_vien) {
        return res.status(400).json({ message: 'Thiếu thông tin nhân viên!' });
    }

    // Kiểm tra số điện thoại hợp lệ
    if (!validatePhoneNumber(SDT)) {
        return res.status(400).json({ message: 'Số điện thoại không hợp lệ!' });
    }

    const checkMaNVQuery = 'SELECT * FROM nhan_vien WHERE Ma_nv = ?';
    try {
        const [existingMaNV] = await db.execute(checkMaNVQuery, [Ma_nv]);
        if (existingMaNV.length > 0) {
            return res.status(400).json({ message: 'Mã nhân viên đã tồn tại!' });
        }

        // Kiểm tra số điện thoại đã tồn tại
        const checkSDTQuery = 'SELECT * FROM nhan_vien WHERE SDT = ?';
        const [existingSDT] = await db.execute(checkSDTQuery, [SDT]);
        if (existingSDT.length > 0) {
            return res.status(400).json({ message: 'Số điện thoại đã tồn tại!' });
        }

        // Thêm nhân viên vào bảng nhan_vien
        const query = `
        INSERT INTO nhan_vien (Ma_nv, Ho_ten_dem, Ten, Ngay_sinh, SDT) 
        VALUES (?, ?, ?, ?, ?)
      `;
        await db.execute(query, [Ma_nv, Ho_ten_dem, Ten, Ngay_sinh, SDT]);

        // Thêm thông tin vào bảng kế thừa dựa trên loại nhân viên
        if (Loai_nhan_vien === 'bao_tri') {
            const insertBaoTriQuery = 'INSERT INTO nhan_vien_bao_tri (Ma_nvbt, Dia_chi_lam_viec) VALUES (?, ?)';
            await db.execute(insertBaoTriQuery, [Ma_nv, Bao_tri]);
        } else if (Loai_nhan_vien === 'giao_hang') {
            const insertGiaoHangQuery = 'INSERT INTO nhan_vien_giao_hang (Ma_nvgh, Bang_lai, Phuong_tien) VALUES (?, ?, ?)';
            await db.execute(insertGiaoHangQuery, [Ma_nv, Giao_hang.bang_lai, Giao_hang.phuong_tien]);
        } else if (Loai_nhan_vien === 'van_phong') {
            const insertVanPhongQuery = 'INSERT INTO nhan_vien_van_phong (Ma_nvvp, Dia_chi_lam_viec, Email) VALUES (?, ?, ?)';
            await db.execute(insertVanPhongQuery, [Ma_nv, Van_phong.dia_chi, Van_phong.email]);
        } else {
            return res.status(400).json({ message: 'Loại nhân viên không hợp lệ!' });
        }

        res.status(201).json({
            message: 'Thêm nhân viên thành công!',
            employee: { Ma_nv, Ho_ten_dem, Ten, Ngay_sinh, SDT, Loai_nhan_vien }
        });
    } catch (err) {
        console.error('Lỗi khi thêm nhân viên:', err);
        res.status(500).json({ message: 'Có lỗi xảy ra khi thêm nhân viên.' });
    }
});

// Cập nhật thông tin nhân viên
router.put('/:Ma_nv', async (req, res) => {
    const { Ma_nv } = req.params;
    const { Ho_ten_dem, Ten, Ngay_sinh, SDT, Loai_nhan_vien, Bao_tri, Giao_hang, Van_phong } = req.body;

    if (!Ho_ten_dem || !Ten || !Ngay_sinh || !SDT || !Loai_nhan_vien) {
        return res.status(400).json({ message: 'Thiếu thông tin nhân viên!' });
    }

    if (!validatePhoneNumber(SDT)) {
        return res.status(400).json({ message: 'Số điện thoại không hợp lệ!' });
    }

    const checkMaNVQuery = 'SELECT * FROM nhan_vien WHERE Ma_nv = ?';
    try {
        const [existingMaNV] = await db.execute(checkMaNVQuery, [Ma_nv]);
        if (existingMaNV.length === 0) {
            return res.status(404).json({ message: 'Mã nhân viên không tồn tại!' });
        }

        // Cập nhật thông tin nhân viên trong bảng nhan_vien
        const updateQuery = `
        UPDATE nhan_vien
        SET Ho_ten_dem = ?, Ten = ?, Ngay_sinh = ?, SDT = ?
        WHERE Ma_nv = ?
      `;
        await db.execute(updateQuery, [Ho_ten_dem, Ten, Ngay_sinh, SDT, Ma_nv]);

        // Cập nhật thông tin trong bảng kế thừa nếu loại nhân viên thay đổi
        if (Loai_nhan_vien === 'bao_tri') {
            const updateBaoTriQuery = 'UPDATE nhan_vien_bao_tri SET Dia_chi_lam_viec = ? WHERE Ma_nvbt = ?';
            await db.execute(updateBaoTriQuery, [Bao_tri, Ma_nv]);
        } else if (Loai_nhan_vien === 'giao_hang') {
            const updateGiaoHangQuery = 'UPDATE nhan_vien_giao_hang SET Bang_lai = ?, Phuong_tien = ? WHERE Ma_nvgh = ?';
            await db.execute(updateGiaoHangQuery, [Giao_hang.bang_lai, Giao_hang.phuong_tien, Ma_nv]);
        } else if (Loai_nhan_vien === 'van_phong') {
            const updateVanPhongQuery = 'UPDATE nhan_vien_van_phong SET Dia_chi_lam_viec = ?, Email = ? WHERE Ma_nvvp = ?';
            await db.execute(updateVanPhongQuery, [Van_phong.dia_chi, Van_phong.email, Ma_nv]);
        }

        res.status(200).json({
            message: 'Cập nhật nhân viên thành công!',
            employee: { Ma_nv, Ho_ten_dem, Ten, Ngay_sinh, SDT, Loai_nhan_vien }
        });
    } catch (err) {
        console.error('Lỗi khi cập nhật nhân viên:', err);
        res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật nhân viên.' });
    }
});

// Xóa nhân viên
router.delete('/:Ma_nv', async (req, res) => {
    const { Ma_nv } = req.params;

    // Kiểm tra sự tồn tại của nhân viên trong bảng nhan_vien
    const checkMaNVQuery = 'SELECT * FROM nhan_vien WHERE Ma_nv = ?';
    try {
        const [existingMaNV] = await db.execute(checkMaNVQuery, [Ma_nv]);
        if (existingMaNV.length === 0) {
            return res.status(404).json({ message: 'Mã nhân viên không tồn tại!' });
        }

        // Xóa thông tin trong các bảng kế thừa
        await db.execute('DELETE FROM nhan_vien_bao_tri WHERE Ma_nvbt = ?', [Ma_nv]);
        await db.execute('DELETE FROM nhan_vien_giao_hang WHERE Ma_nvgh = ?', [Ma_nv]);
        await db.execute('DELETE FROM nhan_vien_van_phong WHERE Ma_nvvp = ?', [Ma_nv]);

        // Xóa nhân viên khỏi bảng nhan_vien
        const deleteQuery = 'DELETE FROM nhan_vien WHERE Ma_nv = ?';
        await db.execute(deleteQuery, [Ma_nv]);

        res.status(200).json({ message: 'Xóa nhân viên thành công!' });
    } catch (err) {
        console.error('Lỗi khi xóa nhân viên:', err);
        res.status(500).json({ message: 'Có lỗi xảy ra khi xóa nhân viên.' });
    }
});

module.exports = router;