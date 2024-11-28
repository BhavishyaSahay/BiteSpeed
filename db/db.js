const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});
pool.getConnection((err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to Database");
  }
});
module.exports = pool.promise();
