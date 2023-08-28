const { querySql } = require("../index.js");

class UserAPI {
  getById = async ({ userId }) => {
    const sql = `SELECT * FROM users WHERE id=${userId}`;
    return querySql(sql);
  };
}

const userAPI = new UserAPI();

module.exports = userAPI;
