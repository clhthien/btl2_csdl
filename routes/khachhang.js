const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  const query = 'SELECT * FROM khach_hang';
  
  try {
    const [results, fields] = await db.execute(query);
    res.json(results);
  } catch (err) {
    console.error('Lỗi truy vấn:', err);
    res.status(500).json({ message: 'Có lỗi xảy ra khi truy vấn cơ sở dữ liệu.' });
  }
});

module.exports = router;
