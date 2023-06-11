const dotenv = require("dotenv");

dotenv.config();

const {
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_NAME,
  CONNECTION_LIMIT,
  DATABASE_PASSWORD,
  PORT
} = process.env;

module.exports = {
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_NAME,
  CONNECTION_LIMIT,
  DATABASE_PASSWORD,
  PORT
}