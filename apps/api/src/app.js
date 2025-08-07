require("module-alias/register");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const routes = require("./routes");
const errorHandler = require("@middlewares/errorHandler");

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api", routes);

app.use(errorHandler);
module.exports = app;
