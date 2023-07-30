const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require('./routes/index.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: '*' }))

app.get("/", (req, res) => {
  res.send("test")
})

app.use("/", router);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
