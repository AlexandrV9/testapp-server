const express = require("express");

const cardRouter = require("./cards.js");
const authRouter = require("./auth.js");

const router = express.Router();

router.use('/cards/', cardRouter);

module.exports = router;