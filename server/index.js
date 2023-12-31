// express.js

const path = require("path");
const express = require("express");
const serverless = require("serverless-http");
require("dotenv").config();
const userController = require("./controllers/users");
const app = express();

// const PORT = process.env.PORT ?? 3000;

app
  .use("/", express.static(path.join(__dirname, "../client/dist/")))
  .use(express.json())

  // CORS
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  })

  .use("/api/v1/users", userController)

  .get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err?.status || 500).json({ message: err?.message || err });
});

console.log("1: Trying to start server...");

console.log("3: End of file, waiting for requests...");

module.exports.handler = serverless(app);
