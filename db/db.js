const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD,
  database: process.env.DB_NAME,
});
pool.getConnection((err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to Database");
  }
});
module.exports = pool.promise();
