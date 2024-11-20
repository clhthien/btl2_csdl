const express = require('express');
const cors = require('cors'); // Import cors
const khachhangRoutes = require('./routes/khachhang'); // Import các routes

const app = express();

// Sử dụng CORS middleware
app.use(cors()); // Cho phép tất cả các domain truy cập API của bạn

app.use(express.json());

// Sử dụng các route API
app.use('/api/khachhang', khachhangRoutes);

// Khởi động server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
