const express = require('express');
const app = express();
const khachhangRoutes = require('./routes/khachhang'); // Import các routes

// Sử dụng JSON middleware để dễ dàng xử lý JSON response
app.use(express.json());

// Thiết lập các route
app.use('/api/khachhang', khachhangRoutes);

// Cấu hình port và khởi động server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
