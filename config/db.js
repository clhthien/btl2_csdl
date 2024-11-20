const mysql = require('mysql2/promise');
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'btl',
  port: 3306
});

module.exports = db;
