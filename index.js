const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const app = express();
const product = require("./api/product");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: '*' }))

app.use("/api/product", product);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
