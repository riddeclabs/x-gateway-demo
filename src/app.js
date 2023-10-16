const compression = require("compression");
const express = require("express");

const app = express();

app.use(compression());

app.use(express.urlencoded({ extended: false }));

app.get("/", (_req, res) => {
  res.status(200).send("hello");
});

module.exports = app;
