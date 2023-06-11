const mysql = require("mysql2");

const { 
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_NAME,
  CONNECTION_LIMIT,
  DATABASE_PASSWORD
} = require("../config.js");

const options = {
  host: DATABASE_HOST,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  connectionLimit: CONNECTION_LIMIT,
}

const pool = mysql.createPool(options);
const promisePool = pool.promise();

const querySql = async (sql) => {
  try {
    const [rows, fields] = await promisePool.execute(sql);
    return rows;
  } catch(error) {
    console.log(error)
    throw new Error(error)
  }
}

const createTable = async () => {
  const sql_create_table_users = `
    CREATE TABLE IF NOT EXISTS users(
      id INT AUTO_INCREMENT,
      email VARCHAR(255) NOT NULL,
      name varchar(50) NOT NULL,
      UNIQUE (email),
      PRIMARY KEY (id)
    )
  `;
  const sql_create_table_cards = `
    CREATE TABLE IF NOT EXISTS cards(
      id INT AUTO_INCREMENT PRIMARY KEY,
      owner_id INT NOT NULL,
      title VARCHAR(50) NOT NULL,
      url VARCHAR(500) NOT NULL,
      likes INT NOT NULL DEFAULT 0,
      date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX (owner_id),
      FOREIGN KEY (owner_id) REFERENCES users (id)
  )`

  await querySql(sql_create_table_users);
  await querySql(sql_create_table_cards);
}

createTable();

module.exports = {
  querySql
}