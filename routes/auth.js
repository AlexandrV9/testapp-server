const express = require("express");
const { 
  loginUser, 
  createUser 
} = require("../controllers/auth");

const authRouter = express.Router();

authRouter.post('/sign-in', loginUser);
authRouter.post('/sign-up', createUser);


module.exports = authRouter;