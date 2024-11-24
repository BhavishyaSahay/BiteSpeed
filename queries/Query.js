const pool = require("../db/db");

const getByEmailOrPhone = async (email, phoneNumber) => {
  const [records] = await pool.execute(
    `SELECT * FROM Contact WHERE email = '${email}' OR phoneNumber = '${phoneNumber}'`
  );

  return records;
};
const getByEmailandPhone = async (email, phoneNumber) => {
  const [records] = await pool.execute(
    `SELECT * FROM Contact WHERE email = '${email}' AND phoneNumber = '${phoneNumber}'`
  );
  return records;
};

const createNewRecord = async (
  email,
  phoneNumber,
  linkedId = null,
  linkPrecedence = "Primary"
) => {
  const [newRecord] = await pool.execute(
    `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence, createdAt, updatedAt) values(?, ?, ?, ?, now(), now())`,
    [email, phoneNumber, linkedId, linkPrecedence]
  );
  return newRecord.insertId;
};

const getContactsByLinkedId = async (primaryId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM Contact WHERE (id = ? or linkedId = ?)`,
    [primaryId, primaryId]
  );
  return rows;
};

const getEmailsFromContact = async (email) => {
  const [emails] = await pool.execute(`SELECT * FROM Contact WHERE email = ?`, [
    email,
  ]);
  return emails;
};
const getPhonesFromContact = async (phone) => {
  const [phones] = await pool.execute(
    `SELECT * FROM Contact WHERE phoneNumber = ?`,
    [phone]
  );
  return phones;
};

const updateContact = async (filters, updates) => {
  const setClause = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");

  const whereClause = Object.keys(filters)
    .map((key) => `${key} = ?`)
    .join(" OR ");

  const values = [...Object.values(updates), ...Object.values(filters)];

  const query = `UPDATE Contact SET ${setClause} WHERE ${whereClause}`;
  await pool.execute(query, values);
};

module.exports = {
  getByEmailOrPhone,
  getByEmailandPhone,
  createNewRecord,
  getContactsByLinkedId,
  getEmailsFromContact,
  getPhonesFromContact,
  updateContact,
};
