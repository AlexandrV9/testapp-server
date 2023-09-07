const authAPI = require("../db/api/auth.js");

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password)
      throw new Error("Нужные поля для создания пользователя не переданы");
    const user = await authAPI.createUser({ name, email, password });

    res.send({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(404).send({
      message: "Такой пользователь с такой почтой уже существует",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authAPI.loginUser({ email, password });
    res.send(user);
  } catch (error) {
    res.status(404).send({
      message: error.message,
    });
  }
};

const checkToken = async (req, res) => {
  const { authorization } = req.headers;
  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new Error("Токен отсутствует");
    }
    const token = authorization.replace('Bearer ', '');
    const user = await authAPI.checkToken({ token });
    res.send(user);
  } catch (error) {
    res.status(404).send({
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  checkToken,
};
