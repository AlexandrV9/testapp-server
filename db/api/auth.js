const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { querySql } = require("../index.js");

const secretKey = "some-secret-key";

class AuthAPI {
  loginUser = async ({ email, password }) => {
    const sql1 = `SELECT * FROM users WHERE email='${email}'`;
    const res1 = await querySql(sql1);

    if (res1.length === 0) {
      throw new Error("Неправильные почта или пароль");
    }

    const { id, name, email: emailUser, password: userPassword } = res1[0];

    const matched = await bcrypt.compare(password, userPassword);

    if (!matched) {
      throw new Error("Неправильные почта или пароль");
    }

    const token = jwt.sign({ id }, secretKey, { expiresIn: "2h" });

    return {
      token,
      email: emailUser,
      name,
    };
  };

  createUser = async ({ email, password, name }) => {
    const hash = await bcrypt.hash(password, 10);
    const sql1 = `INSERT INTO users (email, name, password) VALUES ('${email}', '${name}', '${hash}')`;
    await querySql(sql1);

    const sql2 = `SELECT * FROM users WHERE email='${email}'`;
    const res2 = await querySql(sql2);

    return res2[0];
  };

  checkToken = async ({ token }) => {
    try {
      let { id } = jwt.verify(token, secretKey);
      const sql = `SELECT * FROM users WHERE id='${id}'`;
      const res = await querySql(sql);
      const { name, email } = res[0];
      return {
        name,
        email
      }
    } catch (error) {
      throw new Error("Токен недействителен");
    }
  };
}

const authAPI = new AuthAPI();

module.exports = authAPI;
