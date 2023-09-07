const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const router = require("./routes/index.js");
const { createUser, loginUser, checkToken } = require("./controllers/auth.js");
const auth = require("./middlewares/auth");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("test");
});

app.post("/signup", createUser);
app.post("/signin", loginUser);
app.get("/token", checkToken);

app.use("/", auth, router);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
