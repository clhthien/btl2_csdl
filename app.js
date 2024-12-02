const express = require('express');
const cors = require('cors'); // Import cors

const khachhangRoutes = require('./routes/khachhang');

const nhanvienRoutes = require('./routes/nhanvien');

const dondathangRoutes = require('./routes/dondathang');

const khohangRoutes = require('./routes/khohang');

const app = express();

// Sử dụng CORS middleware
app.use(cors()); // Cho phép tất cả các domain truy cập API của bạn

app.use(express.json());

// Sử dụng các route API
app.use('/api/khachhang', khachhangRoutes);

app.use('/api/nhanvien', nhanvienRoutes);

app.use('/api/dondathang', dondathangRoutes);

app.use('/api/khohang', khohangRoutes)

// Khởi động server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
