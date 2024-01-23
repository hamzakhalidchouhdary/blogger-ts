require("dotenv").config();
const cluster = require("cluster");
const CPUCount = require("os").cpus().length;
import express from "express";
const router = require("./routers/index");
const { errorHandler } = require("./routers/v1/middleware/validations");
import { Express } from "express";

const PORT = process.env.PORT;
const ENV = process.env.NODE_ENV;

const app: Express = express() as Express;

app.use(express.json());
app.use("/", router);
app.use(errorHandler);

const startServer = function () {
  app.listen(PORT, () => {
    console.log(`APP STARTED AT ${PORT} by process id ${process.pid}`);
  });
};

startServer();

module.exports = app;
