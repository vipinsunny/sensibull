const express = require("express");
const app = express();
const path = require("path");

const errorMiddleware = require("./middlewares/error");
const dotenv = require("dotenv");
const cors = require("cors");

const bodyParser = require("body-parser");
dotenv.config({ path: path.join(__dirname, "config/config.env") });
const orderSensibullRoutes = require("./routes/orderSensibullRoutes");
const orderRoutes = require("./routes/orderRoutes")
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use(errorMiddleware);



app.use("/api/v1", orderRoutes);
// app.use("/api/order", orderSensibullRoutes);

module.exports = app;