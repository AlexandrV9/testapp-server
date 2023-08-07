const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { querySql } = require("../index.js");

class AuthAPI {

  loginUser = async ({ email, password }) => {
    const sql1 = `SELECT * FROM users WHERE email='${email}'`;
    const res1 = await querySql(sql1);

    if(res1.length === 0) {
      throw new Error("Неправильные почта или пароль");
    }

    const user = res1[0];

    const matched = await bcrypt.compare(password, user.password);

    if(!matched) {
      throw new Error("Неправильные почта или пароль");
    }

    const token = jwt.sign(
      { id: user.id }, 
      'some-secret-key', 
      { expiresIn: "2h" }
    )

    return { token };

  }

  createUser = async ({ email, password, name }) => {
    const hash = await bcrypt.hash(password, 10);
    const sql1 = `INSERT INTO users (email, name, password) VALUES ('${email}', '${name}', '${hash}')`;
    await querySql(sql1);

    const sql2 = `SELECT * FROM users WHERE email='${email}'`;
    const res2 = await querySql(sql2);

    return res2[0];
  }

}


const authAPI = new AuthAPI();

module.exports = authAPI;